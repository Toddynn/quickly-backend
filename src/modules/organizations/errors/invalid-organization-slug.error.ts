import { BadRequestException } from '@nestjs/common';

export class InvalidOrganizationSlugException extends BadRequestException {
	constructor(message: string) {
		super(message);
		this.name = 'InvalidOrganizationSlugException';
	}
}
