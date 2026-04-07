import type { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MissingOrganizationContextException } from '../errors/missing-organization-context.error';
import { TenantGuard } from './tenant.guard';

const createMockContext = (user: Record<string, unknown> | undefined): ExecutionContext =>
	({
		switchToHttp: () => ({
			getRequest: () => ({ user }),
		}),
		getHandler: () => jest.fn(),
		getClass: () => jest.fn(),
	}) as unknown as ExecutionContext;

describe('TenantGuard', () => {
	let guard: TenantGuard;
	let reflector: Reflector;

	beforeEach(() => {
		reflector = new Reflector();
		guard = new TenantGuard(reflector);
	});

	it('should allow access on public routes regardless of org context', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(true);
		const context = createMockContext(undefined);

		expect(guard.canActivate(context)).toBe(true);
	});

	it('should allow access on non-tenant-scoped routes without org context', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false).mockReturnValueOnce(false);
		const context = createMockContext({ sub: 'user-1' });

		expect(guard.canActivate(context)).toBe(true);
	});

	it('should throw MissingOrganizationContextException on tenant-scoped routes without active_organization_id', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false).mockReturnValueOnce(true);
		const context = createMockContext({ sub: 'user-1', active_organization_id: null });

		expect(() => guard.canActivate(context)).toThrow(MissingOrganizationContextException);
	});

	it('should allow access on tenant-scoped routes with valid active_organization_id', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false).mockReturnValueOnce(true);
		const context = createMockContext({ sub: 'user-1', active_organization_id: 'org-1' });

		expect(guard.canActivate(context)).toBe(true);
	});

	it('should throw when user is undefined on tenant-scoped routes', () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false).mockReturnValueOnce(true);
		const context = createMockContext(undefined);

		expect(() => guard.canActivate(context)).toThrow(MissingOrganizationContextException);
	});
});
