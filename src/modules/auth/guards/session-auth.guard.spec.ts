import { UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SessionAuthGuard } from './session-auth.guard';

const createMockContext = (session: Record<string, unknown> | undefined): ExecutionContext =>
	({
		switchToHttp: () => ({
			getRequest: () => ({ session }),
		}),
		getHandler: () => jest.fn(),
		getClass: () => jest.fn(),
	}) as unknown as ExecutionContext;

describe('SessionAuthGuard', () => {
	let guard: SessionAuthGuard;
	let reflector: Reflector;

	beforeEach(() => {
		reflector = new Reflector();
		guard = new SessionAuthGuard(reflector);
	});

	it('should allow access on public routes without session', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(true);
		const context = createMockContext(undefined);

		expect(guard.canActivate(context)).toBe(true);
	});

	it('should throw UnauthorizedException when session has no userId', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false);
		const context = createMockContext({ email: 'test@test.com' });

		expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
	});

	it('should throw UnauthorizedException when session is undefined', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false);
		const context = createMockContext(undefined);

		expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
	});

	it('should allow access when session has valid userId', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false);
		const context = createMockContext({
			userId: 'user-1',
			email: 'test@test.com',
			activeOrganizationId: null,
			organizationRole: null,
		});

		expect(guard.canActivate(context)).toBe(true);
	});
});
