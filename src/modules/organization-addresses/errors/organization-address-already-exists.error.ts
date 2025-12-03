import { BadRequestException } from '@nestjs/common';

export class OrganizationAddressAlreadyExistsException extends BadRequestException {
	constructor(fields: string) {
		super(`Endereço de organização já existe com os critérios: ${fields}`);
		this.name = 'OrganizationAddressAlreadyExistsException';
	}
}
