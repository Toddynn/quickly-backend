import { randomBytes } from 'node:crypto';
import { env } from '@/shared/constants/env-variables';

export interface BuildMediaFileNameParams {
	organization_id: string;
	original_filename: string;
	extension?: string;
	now?: Date;
}

export class MediaFileName {
	private static readonly FALLBACK_EXTENSION = 'bin';

	private readonly value: string;

	private constructor(storageKey: string) {
		this.value = storageKey;
	}

	static build(params: BuildMediaFileNameParams): MediaFileName {
		const date = params.now ?? new Date();
		const prefix = MediaFileName.normalizeKeySegment(env.AMAZON_S3_MEDIA_BASE_PREFIX, 48, 'media');
		const organizationSegment = MediaFileName.normalizeKeySegment(params.organization_id, 64, 'org');
		const extension = MediaFileName.resolveExtension(params.original_filename, params.extension);
		const uniqueness = date.getTime().toString(36);
		const suffix = randomBytes(4).toString('hex').slice(0, 6);
		const storageKey = `${prefix}-${organizationSegment}-${uniqueness}-${suffix}.${extension}`;

		return new MediaFileName(storageKey);
	}

	toString(): string {
		return this.value;
	}

	getValue(): string {
		return this.value;
	}

	equals(other: MediaFileName): boolean {
		return this.value === other.value;
	}

	private static resolveExtension(originalFilename: string, processedExtension?: string): string {
		const sourceExtension = processedExtension ?? originalFilename.split('.').pop() ?? MediaFileName.FALLBACK_EXTENSION;
		const normalizedExtension = sourceExtension
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9]/g, '');

		return normalizedExtension || MediaFileName.FALLBACK_EXTENSION;
	}

	private static normalizeKeySegment(raw: string, maxLength: number, fallback: string): string {
		const normalized = raw
			.trim()
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/\//g, '-')
			.replace(/[^a-z0-9-]/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '')
			.slice(0, maxLength);

		return normalized || fallback;
	}
}
