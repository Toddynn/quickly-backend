import { NotFoundException } from '@nestjs/common';

export class NotFoundOrganizationInviteException extends NotFoundException {
	constructor(fields: string) {
		super(`Convite da organização não encontrado com os critérios: ${fields}`);
		this.name = 'NotFoundOrganizationInviteException';
	}
}
