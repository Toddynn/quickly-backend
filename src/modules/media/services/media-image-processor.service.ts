import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

export interface ProcessMediaFileParams {
	buffer: Buffer;
	mime_type: string;
	original_filename: string;
}

export interface ProcessMediaFileResult {
	buffer: Buffer;
	mime_type: string;
	extension: string;
	size: number;
	original_filename: string;
}

@Injectable()
export class MediaImageProcessorService {
	async execute(params: ProcessMediaFileParams): Promise<ProcessMediaFileResult> {
		if (!this.isOptimizableImage(params.mime_type)) {
			return {
				buffer: params.buffer,
				mime_type: params.mime_type,
				extension: this.getOriginalExtension(params.original_filename),
				size: params.buffer.byteLength,
				original_filename: params.original_filename,
			};
		}

		const optimizedBuffer = await sharp(params.buffer).rotate().webp({ quality: 80 }).toBuffer();

		return {
			buffer: optimizedBuffer,
			mime_type: 'image/webp',
			extension: 'webp',
			size: optimizedBuffer.byteLength,
			original_filename: params.original_filename,
		};
	}

	private isOptimizableImage(mime_type: string): boolean {
		if (!mime_type.startsWith('image/')) {
			return false;
		}

		return mime_type !== 'image/svg+xml';
	}

	private getOriginalExtension(original_filename: string): string {
		const extension = original_filename
			.split('.')
			.pop()
			?.trim()
			.toLowerCase()
			.replace(/[^a-z0-9]/g, '');

		return extension || 'bin';
	}
}
