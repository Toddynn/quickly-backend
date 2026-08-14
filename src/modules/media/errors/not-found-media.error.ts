import { NotFoundException } from '@nestjs/common';

export class NotFoundMediaException extends NotFoundException {
	constructor(fields: string) {
		super({ message: 'Mídia não encontrada', fields });
		this.name = 'NotFoundMediaException';
	}
}
