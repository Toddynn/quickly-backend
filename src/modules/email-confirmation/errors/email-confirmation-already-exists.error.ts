import { ConflictException } from '@nestjs/common';

export class EmailConfirmationAlreadyExistsException extends ConflictException {
	constructor(fields: string) {
		super({ message: 'Confirmação de email já existe', fields });
		this.name = 'EmailConfirmationAlreadyExistsException';
	}
}
