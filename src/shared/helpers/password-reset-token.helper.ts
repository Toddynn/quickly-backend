import { sign, verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION_TIME = '5m';

export interface PasswordResetTokenPayload {
	userId: string;
	passwordResetId: string;
}

export function generatePasswordResetToken(payload: PasswordResetTokenPayload): string {
	if (!JWT_SECRET) {
		throw new Error('JWT_SECRET não configurado');
	}

	return sign(payload, JWT_SECRET, {
		expiresIn: TOKEN_EXPIRATION_TIME,
	});
}

export function verifyPasswordResetToken(token: string): PasswordResetTokenPayload {
	if (!JWT_SECRET) {
		throw new Error('JWT_SECRET não configurado');
	}

	try {
		const decoded = verify(token, JWT_SECRET) as PasswordResetTokenPayload;
		return decoded;
	} catch (_error) {
		throw new Error('Token inválido ou expirado');
	}
}
