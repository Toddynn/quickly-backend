import { BadRequestException } from '@nestjs/common';

export class CustomerAlreadyLinkedException extends BadRequestException {
	constructor() {
		super('Cliente já está vinculado a um usuário');
		this.name = 'CustomerAlreadyLinkedException';
	}
}

