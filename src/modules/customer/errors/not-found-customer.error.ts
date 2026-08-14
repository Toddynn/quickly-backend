import { NotFoundException } from '@nestjs/common';

export class NotFoundCustomerException extends NotFoundException {
	constructor(fields: string) {
		super({ message: 'Cliente não encontrado', fields });
		this.name = 'NotFoundCustomerException';
	}
}
