import { BadRequestException } from '@nestjs/common';

export class EmailConfirmationAttemptsExceededException extends BadRequestException {
	constructor(maxAttempts: number, hours: number) {
		super(
			`Você excedeu o limite de ${maxAttempts} tentativas de confirmação de email. Tente novamente em ${hours} horas.`,
		);
		this.name = 'EmailConfirmationAttemptsExceededException';
	}
}

