import { NotFoundException } from '@nestjs/common';

export class NotFoundOrganizationMemberException extends NotFoundException {
	constructor(fields: string) {
		super({ message: 'Membro da organização não encontrado', fields });
		this.name = 'NotFoundOrganizationMemberException';
	}
}
