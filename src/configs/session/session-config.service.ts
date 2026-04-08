import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisStore } from 'connect-redis';
import session from 'express-session';
import { type RedisClientType, createClient } from 'redis';
import { IS_PRODUCTION } from '@/shared/constants/env-variables';
import { redisStoreTtlSeconds } from '@/shared/helpers/session-expiry.helper';

@Injectable()
export class SessionConfigService {
	private readonly logger = new Logger(SessionConfigService.name);
	private redisClient: RedisClientType | null = null;
	private isRedisConnected = false;

	constructor(private readonly configService: ConfigService) {}

	async getSessionMiddleware(): Promise<ReturnType<typeof session>> {
		const redisHost = this.configService.get<string>('session.redisHost');
		const redisPort = this.configService.get<number>('session.redisPort');
		const redisPrefix = this.configService.get<string>('session.redisPrefix');
		const redisTtl = this.configService.get<number>('session.redisTtl');
		const sessionName = this.configService.get<string>('session.sessionName');
		const sessionSecret = this.configService.get<string>('session.sessionSecret');

		let redisStore: RedisStore | null = null;

		try {
			const client = await this.connectRedisClient(redisHost, redisPort);
			if (client) {
				redisStore = new RedisStore({
					client,
					prefix: redisPrefix,
					ttl(sess) {
						return redisStoreTtlSeconds(sess, redisTtl);
					},
				});
				this.logger.log('Redis store configured successfully');
			}
		} catch (error) {
			this.logger.error('Failed to configure Redis store, falling back to memory store', error);
		}

		return session({
			name: sessionName,
			store: redisStore || undefined,
			secret: sessionSecret,
			resave: false,
			saveUninitialized: false,
			rolling: true,
			cookie: {
				path: '/',
				httpOnly: true,
				secure: IS_PRODUCTION,
				sameSite: IS_PRODUCTION ? 'none' : 'lax',
			},
		});
	}

	private async connectRedisClient(host: string, port: number): Promise<RedisClientType | null> {
		if (this.redisClient && this.isRedisConnected) {
			return this.redisClient;
		}

		const maxRetries = 3;
		const retryDelay = 1000;

		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			try {
				this.redisClient = createClient({
					socket: { host, port, connectTimeout: 5000 },
				}) as RedisClientType;

				this.redisClient.on('error', (error) => {
					this.logger.error('Redis client error', error);
					this.isRedisConnected = false;
				});

				this.redisClient.on('connect', () => {
					this.logger.log('Redis client connected');
					this.isRedisConnected = true;
				});

				this.redisClient.on('disconnect', () => {
					this.logger.warn('Redis client disconnected');
					this.isRedisConnected = false;
				});

				await this.redisClient.connect();
				this.isRedisConnected = true;

				this.logger.log(`Redis connection established (attempt ${attempt})`);
				return this.redisClient;
			} catch (error) {
				this.logger.warn(`Redis connection attempt ${attempt} failed:`, error);

				if (attempt === maxRetries) {
					this.logger.error('All Redis connection attempts failed');
					return null;
				}

				await new Promise((resolve) => setTimeout(resolve, retryDelay));
			}
		}

		return null;
	}

	async checkRedisHealth(): Promise<boolean> {
		if (!this.redisClient || !this.isRedisConnected) {
			return false;
		}

		try {
			await this.redisClient.ping();
			return true;
		} catch {
			this.isRedisConnected = false;
			return false;
		}
	}
}
