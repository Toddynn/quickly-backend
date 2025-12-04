import { BadRequestException } from '@nestjs/common';

export class PasswordResetAttemptsExceededException extends BadRequestException {
	constructor(maxAttempts: number, hours: number) {
		super(
			`Você excedeu o limite de ${maxAttempts} tentativas de recuperação de senha. Tente novamente em ${hours} horas.`,
		);
		this.name = 'PasswordResetAttemptsExceededException';
	}
}

