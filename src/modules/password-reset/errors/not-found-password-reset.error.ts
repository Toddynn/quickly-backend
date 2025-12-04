import { NotFoundException } from '@nestjs/common';

export class NotFoundPasswordResetException extends NotFoundException {
	constructor(fields: string) {
		super(`Recuperação de senha não encontrada com os critérios: ${fields}`);
		this.name = 'NotFoundPasswordResetException';
	}
}
