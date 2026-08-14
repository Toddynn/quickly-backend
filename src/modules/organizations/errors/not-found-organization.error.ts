import { NotFoundException } from '@nestjs/common';

export class NotFoundOrganizationException extends NotFoundException {
	constructor(fields: string) {
		super({ message: 'Organização não encontrada', fields });
		this.name = 'NotFoundOrganizationException';
	}
}
