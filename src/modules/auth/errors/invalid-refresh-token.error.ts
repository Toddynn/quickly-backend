import { UnauthorizedException } from '@nestjs/common';

export class InvalidRefreshTokenException extends UnauthorizedException {
	constructor() {
		super('Sessão expirada ou inválida. Faça login novamente.');
		this.name = 'InvalidRefreshTokenException';
	}
}
