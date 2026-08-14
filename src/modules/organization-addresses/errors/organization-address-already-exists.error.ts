import { BadRequestException } from '@nestjs/common';

export class OrganizationAddressAlreadyExistsException extends BadRequestException {
	constructor(fields: string) {
		super({ message: 'Endereço da organização já existe', fields });
		this.name = 'OrganizationAddressAlreadyExistsException';
	}
}
