import { NotFoundException } from '@nestjs/common';

export class NotFoundUserException extends NotFoundException {
	constructor(fields: string) {
		super({ message: 'Usuário não encontrado', fields });
		this.name = 'NotFoundUserException';
	}
}
