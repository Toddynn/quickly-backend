import type { Request } from 'express';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import type { SessionUser } from '../../models/interfaces/session-user.interface';

export function saveSession(request: Request): Promise<void> {
	return new Promise((resolve, reject) => {
		request.session.save((err) => {
			if (err) {
				reject(new InternalServerErrorException('Falha ao salvar sessão'));
				return;
			}
			resolve();
		});
	});
}

export function destroySession(request: Request): Promise<void> {
	return new Promise((resolve, reject) => {
		request.session.destroy((err) => {
			if (err) {
				reject(new InternalServerErrorException('Falha ao destruir sessão'));
				return;
			}
			resolve();
		});
	});
}

export function getSessionUser(request: Request): SessionUser {
	const { userId, email, activeOrganizationId, organizationRole } = request.session;

	if (!userId || !email) {
		throw new UnauthorizedException('Sessão inválida ou expirada');
	}

	return { userId, email, activeOrganizationId, organizationRole };
}
