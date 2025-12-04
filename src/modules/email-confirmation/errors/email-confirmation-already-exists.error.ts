import { ConflictException } from '@nestjs/common';

export class EmailConfirmationAlreadyExistsException extends ConflictException {
	constructor(fields: string) {
		super(`Confirmação de email já existe com os critérios: ${fields}`);
		this.name = 'EmailConfirmationAlreadyExistsException';
	}
}

