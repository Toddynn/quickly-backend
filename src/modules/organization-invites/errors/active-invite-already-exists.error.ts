import { ConflictException } from '@nestjs/common';

export class ActiveInviteAlreadyExistsException extends ConflictException {
	constructor() {
		super({ message: 'Já existe um convite ativo para este email nesta organização' });
		this.name = 'ActiveInviteAlreadyExistsException';
	}
}
