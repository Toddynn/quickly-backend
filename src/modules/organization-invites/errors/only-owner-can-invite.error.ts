import { ForbiddenException } from '@nestjs/common';

export class OnlyOwnerCanInviteException extends ForbiddenException {
	constructor() {
		super('Somente o dono da organização pode convidar usuários.');
		this.name = 'OnlyOwnerCanInviteException';
	}
}

