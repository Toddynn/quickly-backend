import { NotFoundException } from '@nestjs/common';

export class NotFoundPasswordResetException extends NotFoundException {
	constructor(fields: string) {
		super({ message: 'Recuperação de senha não encontrada', fields });
		this.name = 'NotFoundPasswordResetException';
	}
}
