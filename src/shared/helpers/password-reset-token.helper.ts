import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { env } from '../constants/env-variables';

const JWT_SECRET = env.JWT_SECRET;
const TOKEN_EXPIRATION_TIME = env.JWT_EXPIRES_IN;

export interface PasswordResetTokenPayload {
	userId: string;
	passwordResetId: string;
}

export function generatePasswordResetToken(payload: PasswordResetTokenPayload): string {
	if (!JWT_SECRET) {
		throw new InternalServerErrorException('Erro de configuração do servidor. Contate o suporte.');
	}

	return sign(payload, JWT_SECRET, {
		expiresIn: TOKEN_EXPIRATION_TIME,
	});
}

export function verifyPasswordResetToken(token: string): PasswordResetTokenPayload {
	if (!JWT_SECRET) {
		throw new InternalServerErrorException('Erro de configuração do servidor. Contate o suporte.');
	}

	try {
		const decoded = verify(token, JWT_SECRET) as PasswordResetTokenPayload;
		return decoded;
	} catch (_error) {
		throw new BadRequestException('Token inválido ou expirado');
	}
}
