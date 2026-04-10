import type { NextFunction, Request, Response } from 'express';
import { alignAuthenticatedSessionExpiry, clearSessionCookie, destroySession } from '@/modules/auth/shared/helpers/session.helper';
import { remainingAbsoluteMs } from '@/shared/helpers/session-expiry.helper';

export function authenticatedSessionLifecycleMiddleware(req: Request, res: Response, next: NextFunction): void {
	void (async () => {
		try {
			if (!req.session?.userId) {
				next();
				return;
			}
			const start = req.session.sessionStartedAt;
			if (typeof start !== 'number' || typeof req.session.rememberMe !== 'boolean') {
				await destroySession(req);
				clearSessionCookie(res);
				next();
				return;
			}
			if (remainingAbsoluteMs(start) <= 0) {
				await destroySession(req);
				clearSessionCookie(res);
				next();
				return;
			}
			if (!alignAuthenticatedSessionExpiry(req)) {
				await destroySession(req);
				clearSessionCookie(res);
				next();
				return;
			}
			req.session.touch();
			next();
		} catch (error) {
			next(error as Error);
		}
	})();
}
