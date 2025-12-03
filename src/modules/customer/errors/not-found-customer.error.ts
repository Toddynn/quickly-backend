import { NotFoundException } from '@nestjs/common';

export class NotFoundCustomerException extends NotFoundException {
	constructor(fields: string) {
		super(`Cliente não encontrado com os critérios: ${fields}`);
		this.name = 'NotFoundCustomerException';
	}
}
