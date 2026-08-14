import { NotFoundException } from '@nestjs/common';

export class NotFoundOrganizationInviteException extends NotFoundException {
	constructor(fields: string) {
		super({ message: 'Convite da organização não encontrado', fields });
		this.name = 'NotFoundOrganizationInviteException';
	}
}
