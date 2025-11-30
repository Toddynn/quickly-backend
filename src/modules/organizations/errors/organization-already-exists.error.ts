import { BadRequestException } from '@nestjs/common';

export class OrganizationAlreadyExistsException extends BadRequestException {
	constructor(fields: string) {
		super(`Organização já existe com os critérios: ${fields}`);
		this.name = 'OrganizationAlreadyExistsException';
	}
}

