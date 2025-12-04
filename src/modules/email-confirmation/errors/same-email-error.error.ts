import { BadRequestException } from '@nestjs/common';

export class SameEmailError extends BadRequestException {
	constructor(message = 'O novo email deve ser diferente do email atual.') {
		super(message);
		this.name = 'SameEmailError';
	}
}

