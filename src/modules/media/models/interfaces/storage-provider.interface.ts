export interface UploadStorageObjectParams {
	storage_key: string;
	body: Buffer;
	mime_type: string;
}

export interface UploadStorageObjectResult {
	storage_key: string;
	size: number;
	mime_type: string;
}

export interface DeleteStorageObjectParams {
	storage_key: string;
}

export interface PresignedGetObjectParams {
	storage_key: string;
}

export interface StorageProviderInterface {
	upload(params: UploadStorageObjectParams): Promise<UploadStorageObjectResult>;
	replace(params: UploadStorageObjectParams): Promise<UploadStorageObjectResult>;
	delete(params: DeleteStorageObjectParams): Promise<void>;
	getPresignedGetObjectUrl(params: PresignedGetObjectParams): Promise<string>;
}
