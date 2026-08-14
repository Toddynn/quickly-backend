import { ConflictException } from '@nestjs/common';

export class PasswordResetAlreadyExistsException extends ConflictException {
	constructor(fields: string) {
		super({ message: 'Recuperação de senha já solicitada', fields });
		this.name = 'PasswordResetAlreadyExistsException';
	}
}
