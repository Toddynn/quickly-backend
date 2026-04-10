import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3StorageProvider } from './s3-storage.provider';

jest.mock('@aws-sdk/s3-request-presigner', () => ({
	getSignedUrl: jest.fn(),
}));

describe('S3StorageProvider', () => {
	beforeEach(() => {
		jest.mocked(getSignedUrl).mockReset();
	});

	it('deve enviar arquivo e retornar metadados do upload', async () => {
		const provider = new S3StorageProvider();
		const sendMock = jest.fn().mockResolvedValue({});
		(provider as unknown as { client: { send: typeof sendMock } }).client.send = sendMock;

		const result = await provider.upload({
			storage_key: 'qkly-media/org-1/2026/04/user/file.webp',
			body: Buffer.from('binary'),
			mime_type: 'image/webp',
		});

		expect(sendMock).toHaveBeenCalledTimes(1);
		expect(result.storage_key).toBe('qkly-media/org-1/2026/04/user/file.webp');
		expect(result.mime_type).toBe('image/webp');
		expect(result.size).toBe(Buffer.from('binary').byteLength);
	});

	it('deve remover arquivo do bucket', async () => {
		const provider = new S3StorageProvider();
		const sendMock = jest.fn().mockResolvedValue({});
		(provider as unknown as { client: { send: typeof sendMock } }).client.send = sendMock;

		await provider.delete({
			storage_key: 'qkly-media/org-1/2026/04/user/file.webp',
		});

		expect(sendMock).toHaveBeenCalledTimes(1);
	});

	it('deve gerar URL pré-assinada para GetObject', async () => {
		jest.mocked(getSignedUrl).mockResolvedValue(
			'https://bucket.s3.us-east-1.amazonaws.com/key?X-Amz-Algorithm=AWS4-HMAC-SHA256',
		);

		const provider = new S3StorageProvider();
		const url = await provider.getPresignedGetObjectUrl({ storage_key: 'my-object-key' });

		expect(url).toBe('https://bucket.s3.us-east-1.amazonaws.com/key?X-Amz-Algorithm=AWS4-HMAC-SHA256');
		expect(getSignedUrl).toHaveBeenCalled();
	});
});
