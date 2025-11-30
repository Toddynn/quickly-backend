import { NotFoundException } from '@nestjs/common';

export class NotFoundOrganizationServiceException extends NotFoundException {
	constructor(fields: string) {
		super(`Serviço não encontrado com os critérios: ${fields}`);
		this.name = 'NotFoundOrganizationServiceException';
	}
}
