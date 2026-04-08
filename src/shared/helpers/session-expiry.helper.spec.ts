import { redisStoreTtlSeconds } from './session-expiry.helper';

describe('session-expiry.helper', () => {
	describe('redisStoreTtlSeconds', () => {
		it('caps redis ttl by remaining absolute time when cookie suggests longer', () => {
			const now = Date.UTC(2025, 0, 1, 12, 0, 0);
			const startedAt = now - 29 * 24 * 60 * 60 * 1000;
			const ttl = redisStoreTtlSeconds(
				{
					cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
					sessionStartedAt: startedAt,
				},
				86400,
				now,
			);
			expect(ttl).toBeGreaterThan(0);
			expect(ttl).toBeLessThanOrEqual(2 * 24 * 60 * 60);
		});

		it('uses fallback when sessionStartedAt is missing', () => {
			const ttl = redisStoreTtlSeconds({ cookie: {} }, 99);
			expect(ttl).toBe(99);
		});
	});
});
