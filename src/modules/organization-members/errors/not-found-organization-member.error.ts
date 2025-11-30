import { NotFoundException } from '@nestjs/common';

export class NotFoundOrganizationMemberException extends NotFoundException {
	constructor(fields: string) {
		super(`Membro da organização não encontrado com os critérios: ${fields}`);
		this.name = 'NotFoundOrganizationMemberException';
	}
}
