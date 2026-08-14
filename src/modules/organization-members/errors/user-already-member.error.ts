import { ConflictException } from '@nestjs/common';

export class UserAlreadyMemberException extends ConflictException {
	constructor() {
		super({ message: 'Este usuário já é membro da organização' });
		this.name = 'UserAlreadyMemberException';
	}
}
