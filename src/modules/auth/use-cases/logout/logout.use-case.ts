import { Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';
import { destroySessionAndClearCookie } from '../../shared/helpers/session.helper';

@Injectable()
export class LogoutUseCase {
	async execute(request: Request, response: Response): Promise<void> {
		await destroySessionAndClearCookie(request, response);
	}
}
