import { BadRequestException } from '@nestjs/common';

export class CustomerAlreadyExistsException extends BadRequestException {
	constructor(fields: string) {
		super({ message: 'Cliente já existe', fields });
		this.name = 'CustomerAlreadyExistsException';
	}
}
