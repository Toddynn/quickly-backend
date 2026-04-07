import { BadRequestException } from '@nestjs/common';

export class EmailNotVerifiedException extends BadRequestException {
	constructor() {
		super('Email não verificado. Por favor, verifique seu email antes de continuar.');
		this.name = 'EmailNotVerifiedException';
	}
}
