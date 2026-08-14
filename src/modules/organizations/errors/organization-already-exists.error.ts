import { BadRequestException } from '@nestjs/common';

export class OrganizationAlreadyExistsException extends BadRequestException {
	constructor(fields?: string) {
		super(fields ? { message: 'Organização já existe', fields } : { message: 'Organização já existe' });
		this.name = 'OrganizationAlreadyExistsException';
	}
}
