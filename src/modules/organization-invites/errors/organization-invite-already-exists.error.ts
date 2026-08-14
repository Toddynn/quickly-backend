import { BadRequestException } from '@nestjs/common';

export class OrganizationInviteAlreadyExistsException extends BadRequestException {
	constructor(fields: string) {
		super({ message: 'Convite da organização já existe', fields });
		this.name = 'OrganizationInviteAlreadyExistsException';
	}
}
