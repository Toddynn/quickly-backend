import { BadRequestException } from '@nestjs/common';

export class OrganizationMemberAlreadyExistsException extends BadRequestException {
	constructor(fields: string) {
		super(`Membro da organização já existe com os critérios: ${fields}`);
		this.name = 'OrganizationMemberAlreadyExistsException';
	}
}

