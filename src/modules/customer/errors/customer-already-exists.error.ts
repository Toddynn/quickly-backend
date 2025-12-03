import { BadRequestException } from '@nestjs/common';

export class CustomerAlreadyExistsException extends BadRequestException {
	constructor(fields: string) {
		super(`Cliente já existe com os critérios: ${fields}`);
		this.name = 'CustomerAlreadyExistsException';
	}
}

