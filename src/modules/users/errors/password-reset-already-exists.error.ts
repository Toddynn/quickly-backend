import { ConflictException } from '@nestjs/common';

export class PasswordResetAlreadyExistsException extends ConflictException {
	constructor(fields: string) {
		super(`Password reset já existe com os critérios: ${fields}`);
		this.name = 'PasswordResetAlreadyExistsException';
	}
}
