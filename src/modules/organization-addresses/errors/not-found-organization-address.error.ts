import { NotFoundException } from '@nestjs/common';

export class NotFoundOrganizationAddressException extends NotFoundException {
	constructor(fields: string) {
		super({ message: 'Endereço da organização não encontrado', fields });
		this.name = 'NotFoundOrganizationAddressException';
	}
}
