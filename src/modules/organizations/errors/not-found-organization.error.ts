import { NotFoundException } from '@nestjs/common';

export class NotFoundOrganizationException extends NotFoundException {
	constructor(fields: string) {
		super(`Organização não encontrada com os critérios: ${fields}`);
		this.name = 'NotFoundOrganizationException';
	}
}
