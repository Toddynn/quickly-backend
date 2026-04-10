import sharp from 'sharp';
import { MediaImageProcessorService } from './media-image-processor.service';

describe('MediaImageProcessorService', () => {
	let service: MediaImageProcessorService;

	beforeEach(() => {
		service = new MediaImageProcessorService();
	});

	it('deve otimizar imagem para webp com qualidade 80', async () => {
		const inputBuffer = await sharp({
			create: {
				width: 10,
				height: 10,
				channels: 3,
				background: { r: 255, g: 0, b: 0 },
			},
		})
			.png()
			.toBuffer();

		const result = await service.execute({
			buffer: inputBuffer,
			mime_type: 'image/png',
			original_filename: 'avatar.png',
		});

		expect(result.mime_type).toBe('image/webp');
		expect(result.extension).toBe('webp');
		expect(result.size).toBeGreaterThan(0);
		expect(result.buffer.equals(inputBuffer)).toBe(false);
	});

	it('deve manter arquivo original quando não for imagem', async () => {
		const inputBuffer = Buffer.from('conteudo de texto');
		const result = await service.execute({
			buffer: inputBuffer,
			mime_type: 'text/plain',
			original_filename: 'arquivo.txt',
		});

		expect(result.mime_type).toBe('text/plain');
		expect(result.extension).toBe('txt');
		expect(result.size).toBe(inputBuffer.byteLength);
		expect(result.buffer).toEqual(inputBuffer);
	});
});
