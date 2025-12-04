import { ConflictException } from '@nestjs/common';

export class PasswordResetAlreadyExistsException extends ConflictException {
	constructor(fields: string) {
		super(`Recuperação de senha já solicitada com os critérios: ${fields}`);
		this.name = 'PasswordResetAlreadyExistsException';
	}
}
