import type { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OrganizationRole } from '@/shared/constants/organization-roles';
import { RolesGuard } from './roles.guard';

const createMockContext = (session: Record<string, unknown> | undefined): ExecutionContext =>
	({
		switchToHttp: () => ({
			getRequest: () => ({ session }),
		}),
		getHandler: () => jest.fn(),
		getClass: () => jest.fn(),
	}) as unknown as ExecutionContext;

describe('RolesGuard', () => {
	let guard: RolesGuard;
	let reflector: Reflector;

	beforeEach(() => {
		reflector = new Reflector();
		guard = new RolesGuard(reflector);
	});

	it('should allow access when no roles are required', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
		const context = createMockContext({ organizationRole: null });

		expect(guard.canActivate(context)).toBe(true);
	});

	it('should deny access when session has no organizationRole', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([OrganizationRole.OWNER]);
		const context = createMockContext({ organizationRole: null });

		expect(guard.canActivate(context)).toBe(false);
	});

	it('should allow OWNER to access OWNER-only routes', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([OrganizationRole.OWNER]);
		const context = createMockContext({ organizationRole: OrganizationRole.OWNER });

		expect(guard.canActivate(context)).toBe(true);
	});

	it('should deny PROFESSIONAL from OWNER-only routes', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([OrganizationRole.OWNER]);
		const context = createMockContext({ organizationRole: OrganizationRole.PROFESSIONAL });

		expect(guard.canActivate(context)).toBe(false);
	});

	it('should allow PROFESSIONAL on routes that accept both roles', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([OrganizationRole.OWNER, OrganizationRole.PROFESSIONAL]);
		const context = createMockContext({ organizationRole: OrganizationRole.PROFESSIONAL });

		expect(guard.canActivate(context)).toBe(true);
	});

	it('should allow OWNER on routes that accept both roles', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([OrganizationRole.OWNER, OrganizationRole.PROFESSIONAL]);
		const context = createMockContext({ organizationRole: OrganizationRole.OWNER });

		expect(guard.canActivate(context)).toBe(true);
	});

	it('should deny access when session is undefined', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([OrganizationRole.OWNER]);
		const context = createMockContext(undefined);

		expect(guard.canActivate(context)).toBe(false);
	});
});
