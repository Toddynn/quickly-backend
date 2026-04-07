import type { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OrganizationRole } from '@/shared/constants/organization-roles';
import { RolesGuard } from './roles.guard';

const createMockContext = (user: Record<string, unknown> | undefined): ExecutionContext =>
	({
		switchToHttp: () => ({
			getRequest: () => ({ user }),
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
		const context = createMockContext({ organization_role: null });

		expect(guard.canActivate(context)).toBe(true);
	});

	it('should deny access when user has no organization_role', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([OrganizationRole.OWNER]);
		const context = createMockContext({ organization_role: null });

		expect(guard.canActivate(context)).toBe(false);
	});

	it('should allow OWNER to access OWNER-only routes', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([OrganizationRole.OWNER]);
		const context = createMockContext({ organization_role: OrganizationRole.OWNER });

		expect(guard.canActivate(context)).toBe(true);
	});

	it('should deny PROFESSIONAL from OWNER-only routes', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([OrganizationRole.OWNER]);
		const context = createMockContext({ organization_role: OrganizationRole.PROFESSIONAL });

		expect(guard.canActivate(context)).toBe(false);
	});

	it('should allow PROFESSIONAL on routes that accept both roles', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([OrganizationRole.OWNER, OrganizationRole.PROFESSIONAL]);
		const context = createMockContext({ organization_role: OrganizationRole.PROFESSIONAL });

		expect(guard.canActivate(context)).toBe(true);
	});

	it('should allow OWNER on routes that accept both roles', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([OrganizationRole.OWNER, OrganizationRole.PROFESSIONAL]);
		const context = createMockContext({ organization_role: OrganizationRole.OWNER });

		expect(guard.canActivate(context)).toBe(true);
	});

	it('should deny access when user object is undefined', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([OrganizationRole.OWNER]);
		const context = createMockContext(undefined);

		expect(guard.canActivate(context)).toBe(false);
	});
});
