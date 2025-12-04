import { ConflictException } from '@nestjs/common';

export class EmailAlreadyInUseException extends ConflictException {
	constructor(message = 'Este email já está em uso.') {
		super(message);
		this.name = 'EmailAlreadyInUseException';
	}
}

