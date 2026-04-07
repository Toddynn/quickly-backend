import { ForbiddenException } from '@nestjs/common';

export class NotMemberOfOrganizationException extends ForbiddenException {
	constructor() {
		super('Usuário não é membro ativo desta organização.');
		this.name = 'NotMemberOfOrganizationException';
	}
}
