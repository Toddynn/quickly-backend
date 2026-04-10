import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { env } from '@/shared/constants/env-variables';
import type {
	DeleteStorageObjectParams,
	StorageProviderInterface,
	UploadStorageObjectParams,
	UploadStorageObjectResult,
} from '../../models/interfaces/storage-provider.interface';

@Injectable()
export class S3StorageProvider implements StorageProviderInterface {
	private readonly bucket = env.AMAZON_S3_BUCKET;
	private readonly client = new S3Client({
		region: env.AMAZON_REGION,
		credentials: {
			accessKeyId: env.AMAZON_ACCESS_KEY_ID,
			secretAccessKey: env.AMAZON_SECRET_ACCESS_KEY,
		},
	});

	async upload(params: UploadStorageObjectParams): Promise<UploadStorageObjectResult> {
		await this.client.send(
			new PutObjectCommand({
				Bucket: this.bucket,
				Key: params.storage_key,
				Body: params.body,
				ContentType: params.mime_type,
			}),
		);

		return {
			storage_key: params.storage_key,
			size: params.body.byteLength,
			mime_type: params.mime_type,
		};
	}

	replace(params: UploadStorageObjectParams): Promise<UploadStorageObjectResult> {
		return this.upload(params);
	}

	async delete(params: DeleteStorageObjectParams): Promise<void> {
		await this.client.send(
			new DeleteObjectCommand({
				Bucket: this.bucket,
				Key: params.storage_key,
			}),
		);
	}

	async getPresignedGetObjectUrl(params: { storage_key: string }): Promise<string> {
		return getSignedUrl(
			this.client,
			new GetObjectCommand({
				Bucket: this.bucket,
				Key: params.storage_key,
			}),
			{ expiresIn: env.AMAZON_S3_PRESIGNED_GET_EXPIRES_SECONDS },
		);
	}
}
