import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import type session from 'express-session';
import { env } from '@/shared/constants/env-variables';
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

type SessionStoreRecord = session.SessionData & {
	cookie: session.Cookie;
};

export function findSessionById(request: Request, sessionId: string): Promise<SessionStoreRecord | null> {
	return new Promise((resolve, reject) => {
		request.sessionStore.get(sessionId, (error, sessionData) => {
			if (error) {
				reject(new InternalServerErrorException('Falha ao buscar sessão'));
				return;
			}

			resolve((sessionData as SessionStoreRecord | undefined) ?? null);
		});
	});
}

export function destroySessionById(request: Request, sessionId: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		request.sessionStore.destroy(sessionId, (error) => {
			if (error) {
				reject(new InternalServerErrorException('Falha ao destruir sessão'));
				return;
			}

			resolve();
		});
	});
}

export function clearSessionCookie(response: Response): void {
	const isProduction = process.env.NODE_ENV === 'production';
	response.clearCookie(env.SESSION_NAME, {
		path: '/',
		httpOnly: true,
		secure: isProduction,
		sameSite: isProduction ? 'none' : 'lax',
	});
}

export async function destroySessionAndClearCookie(request: Request, response: Response): Promise<void> {
	await destroySession(request);
	clearSessionCookie(response);
}

export async function destroySessionByIdAndClearCookie(request: Request, response: Response, sessionId: string): Promise<void> {
	await destroySessionById(request, sessionId);
	if (request.sessionID === sessionId) {
		clearSessionCookie(response);
	}
}

export function getSessionUser(request: Request): SessionUser {
	const { userId, email, activeOrganizationId, organizationRole } = request.session;

	if (!userId || !email) {
		throw new UnauthorizedException('Sessão inválida ou expirada');
	}

	return { userId, email, activeOrganizationId, organizationRole };
}
