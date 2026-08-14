import { BadRequestException } from '@nestjs/common';

export class OrganizationMemberAlreadyExistsException extends BadRequestException {
	constructor(fields: string) {
		super({ message: 'Membro da organização já existe', fields });
		this.name = 'OrganizationMemberAlreadyExistsException';
	}
}
