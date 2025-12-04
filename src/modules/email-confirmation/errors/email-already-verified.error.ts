import { BadRequestException } from '@nestjs/common';

export class EmailAlreadyVerifiedException extends BadRequestException {
	constructor(message = 'Este email já está verificado.') {
		super(message);
		this.name = 'EmailAlreadyVerifiedException';
	}
}

