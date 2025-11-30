import { BadRequestException } from '@nestjs/common';

export class OrganizationInviteAlreadyExistsException extends BadRequestException {
	constructor(fields: string) {
		super(`Convite da organização já existe com os critérios: ${fields}`);
		this.name = 'OrganizationInviteAlreadyExistsException';
	}
}
