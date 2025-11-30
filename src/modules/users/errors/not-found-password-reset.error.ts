import { NotFoundException } from '@nestjs/common';

export class NotFoundPasswordResetException extends NotFoundException {
	constructor(fields: string) {
		super(`Password reset não encontrado com os critérios: ${fields}`);
		this.name = 'NotFoundPasswordResetException';
	}
}
