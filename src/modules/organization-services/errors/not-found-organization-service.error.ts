import { NotFoundException } from '@nestjs/common';

export class NotFoundOrganizationServiceException extends NotFoundException {
	constructor(fields: string) {
		super({ message: 'Serviço não encontrado', fields });
		this.name = 'NotFoundOrganizationServiceException';
	}
}
