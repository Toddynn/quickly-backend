import { Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';
import { env } from '@/shared/constants/env-variables';
import { destroySession } from '../../shared/helpers/session.helper';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

@Injectable()
export class LogoutUseCase {
	async execute(request: Request, response: Response): Promise<void> {
		await destroySession(request);

		response.clearCookie(env.SESSION_NAME, {
			path: '/',
			httpOnly: true,
			secure: IS_PRODUCTION,
			sameSite: IS_PRODUCTION ? 'none' : 'lax',
		});
	}
}
