import { createHash } from 'node:crypto';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { SessionConfigService } from '@/configs/session/session-config.service';
import { APP_CACHE_PREFIX } from './cache-key.constant';

export type ListAppCacheKeysResult = {
	keys: string[];
	nextCursor: string;
	hasMore: boolean;
};

@Injectable()
export class AppCacheService {
	private readonly logger = new Logger(AppCacheService.name);

	constructor(private readonly sessionConfigService: SessionConfigService) {}

	async getOrSet<T>(key: string, ttlSeconds: number, factory: () => Promise<T>): Promise<T> {
		const client = await this.sessionConfigService.getRedisClient();

		if (!client) {
			return factory();
		}

		const fullKey = `${APP_CACHE_PREFIX}${key}`;

		try {
			const cached = await client.get(fullKey);

			if (typeof cached === 'string') {
				return JSON.parse(cached) as T;
			}
		} catch (error) {
			this.logger.warn(`Falha ao ler cache ${fullKey}`, error instanceof Error ? error.message : error);
		}

		const value = await factory();

		try {
			await client.set(fullKey, JSON.stringify(value), { EX: ttlSeconds });
		} catch (error) {
			this.logger.warn(`Falha ao gravar cache ${fullKey}`, error instanceof Error ? error.message : error);
		}

		return value;
	}

	async listKeys({ cursor = '0', count = 50 }: { cursor?: string; count?: number }): Promise<ListAppCacheKeysResult> {
		const client = await this.sessionConfigService.getRedisClient();

		if (!client) {
			return { keys: [], nextCursor: '0', hasMore: false };
		}

		try {
			const collected: string[] = [];
			let currentCursor = cursor;
			let iterations = 0;
			const maxIterations = 20;

			do {
				const result = await client.scan(currentCursor, {
					MATCH: `${APP_CACHE_PREFIX}*`,
					COUNT: count,
				});

				currentCursor = String(result.cursor);

				for (const fullKey of result.keys) {
					collected.push(this.toRelativeKey(String(fullKey)));
				}

				iterations += 1;
			} while (collected.length < count && currentCursor !== '0' && iterations < maxIterations);

			return {
				keys: collected,
				nextCursor: currentCursor,
				hasMore: currentCursor !== '0',
			};
		} catch (error) {
			this.logger.warn('Falha ao listar keys de cache', error instanceof Error ? error.message : error);
			return { keys: [], nextCursor: '0', hasMore: false };
		}
	}

	async invalidate(keys: string[]): Promise<void> {
		const client = await this.sessionConfigService.getRedisClient();

		if (!client || keys.length === 0) {
			return;
		}

		const fullKeys = keys.map((key) => `${APP_CACHE_PREFIX}${key}`);

		try {
			await client.del(fullKeys);
		} catch (error) {
			this.logger.warn('Falha ao invalidar cache', error instanceof Error ? error.message : error);
		}
	}

	async invalidateByPrefix(prefix: string): Promise<void> {
		const client = await this.sessionConfigService.getRedisClient();

		if (!client) {
			return;
		}

		const match = `${APP_CACHE_PREFIX}${prefix}*`;

		try {
			for await (const keys of client.scanIterator({ MATCH: match, COUNT: 100 })) {
				if (keys.length > 0) {
					await client.del(keys);
				}
			}
		} catch (error) {
			this.logger.warn(`Falha ao invalidar cache por prefixo ${prefix}`, error instanceof Error ? error.message : error);
		}
	}

	assertRelativeCacheKey(raw: string): string {
		const relative = this.toRelativeKey(raw);

		if (relative.length === 0) {
			throw new BadRequestException('Key de cache inválida.');
		}

		this.assertSafeRelativePath(relative);
		return relative;
	}

	assertRelativeCachePrefix(raw: string): string {
		const relative = this.toRelativeKey(raw);
		this.assertSafeRelativePath(relative);
		return relative;
	}

	buildListCacheKey(prefix: string, payload: unknown): string {
		const hash = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
		return `${prefix}${hash}`;
	}

	private toRelativeKey(raw: string): string {
		let value = raw.trim();

		if (value.startsWith(APP_CACHE_PREFIX)) {
			value = value.slice(APP_CACHE_PREFIX.length);
		}

		if (value.endsWith('*')) {
			value = value.slice(0, -1);
		}

		return value;
	}

	private assertSafeRelativePath(relative: string): void {
		if (relative.includes('\0')) {
			throw new BadRequestException('Key de cache inválida.');
		}
	}
}
