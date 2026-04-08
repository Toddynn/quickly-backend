import { ForbiddenException } from '@nestjs/common';

export class UnableToDeleteOrganizationException extends ForbiddenException {
	constructor() {
		super('Somente o dono da organização pode excluí-la.');
		this.name = 'UnableToDeleteOrganizationException';
	}
}
