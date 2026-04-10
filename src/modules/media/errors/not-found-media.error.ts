import { NotFoundException } from '@nestjs/common';

export class NotFoundMediaException extends NotFoundException {
	constructor(fields: string) {
		super(`Mídia não encontrada com os critérios: ${fields}`);
		this.name = 'NotFoundMediaException';
	}
}
