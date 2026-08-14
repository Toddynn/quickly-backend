import { NotFoundException } from '@nestjs/common';

export class NotFoundEmailConfirmationException extends NotFoundException {
	constructor(fields: string) {
		super({ message: 'Confirmação de email não encontrada', fields });
		this.name = 'NotFoundEmailConfirmationException';
	}
}
