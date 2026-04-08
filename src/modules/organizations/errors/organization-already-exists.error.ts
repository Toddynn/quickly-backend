import { BadRequestException } from '@nestjs/common';

export class OrganizationAlreadyExistsException extends BadRequestException {
	constructor(message: string) {
		super(message);
		this.name = 'OrganizationAlreadyExistsException';
	}
}
