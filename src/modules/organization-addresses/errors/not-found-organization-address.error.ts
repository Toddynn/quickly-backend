import { NotFoundException } from '@nestjs/common';

export class NotFoundOrganizationAddressException extends NotFoundException {
	constructor(fields: string) {
		super(`Endereço de organização não encontrado com os critérios: ${fields}`);
		this.name = 'NotFoundOrganizationAddressException';
	}
}
