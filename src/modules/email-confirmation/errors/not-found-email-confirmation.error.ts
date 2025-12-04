import { NotFoundException } from '@nestjs/common';

export class NotFoundEmailConfirmationException extends NotFoundException {
	constructor(fields: string) {
		super(`Confirmação de email não encontrada com os critérios: ${fields}`);
		this.name = 'NotFoundEmailConfirmationException';
	}
}

