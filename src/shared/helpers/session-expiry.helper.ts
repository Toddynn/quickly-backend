import { env } from '@/shared/constants/env-variables';

export function idleDurationMs(rememberMe: boolean): number {
	return (rememberMe ? env.SESSION_REMEMBER_ME_IDLE_SECONDS : env.SESSION_IDLE_SECONDS) * 1000;
}

export function absoluteWindowMs(): number {
	return env.SESSION_ABSOLUTE_MAX_SECONDS * 1000;
}

export function remainingAbsoluteMs(sessionStartedAt: number, nowMs = Date.now()): number {
	return sessionStartedAt + absoluteWindowMs() - nowMs;
}

export function computeEffectiveMaxAgeMs(rememberMe: boolean, sessionStartedAt: number, nowMs = Date.now()): number | null {
	const remAbs = remainingAbsoluteMs(sessionStartedAt, nowMs);
	if (remAbs <= 0) {
		return null;
	}
	const idle = idleDurationMs(rememberMe);
	return Math.min(idle, remAbs);
}

type SessionLike = {
	cookie?: { expires?: Date | string | null; maxAge?: number | null };
	sessionStartedAt?: unknown;
};

export function cookieRemainingSeconds(sess: SessionLike, nowMs = Date.now()): number {
	const exp = sess.cookie?.expires;
	if (exp) {
		const ts = typeof exp === 'string' ? Date.parse(exp) : new Date(exp).getTime();
		return Math.max(0, Math.floor((ts - nowMs) / 1000));
	}
	if (typeof sess.cookie?.maxAge === 'number' && sess.cookie.maxAge > 0) {
		return Math.max(0, Math.floor(sess.cookie.maxAge / 1000));
	}
	return 0;
}

export function redisStoreTtlSeconds(sess: SessionLike, fallbackSeconds: number, nowMs = Date.now()): number {
	const cookieSec = cookieRemainingSeconds(sess, nowMs);
	const start = sess.sessionStartedAt;
	if (typeof start !== 'number') {
		return Math.max(1, cookieSec > 0 ? cookieSec : fallbackSeconds);
	}
	const absSec = Math.max(0, Math.floor(remainingAbsoluteMs(start, nowMs) / 1000));
	const cookieOrAbs = cookieSec > 0 ? cookieSec : absSec;
	return Math.max(1, Math.min(cookieOrAbs, absSec));
}
