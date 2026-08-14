import { BadRequestException } from '@nestjs/common';

export class UserAlreadyExistsException extends BadRequestException {
	constructor(fields: string) {
		super({ message: 'Usuário já existe', fields });
		this.name = 'UserAlreadyExistsException';
	}
}
