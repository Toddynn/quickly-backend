import type { ExecutionContext } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SubscriptionStatus } from '@/modules/subscriptions/shared/enums/subscription-status.enum';
import type { GetExistingSubscriptionUseCase } from '@/modules/subscriptions/use-cases/get-existing-subscription/get-existing-subscription.use-case';
import { SubscriptionStatusGuard } from './subscription-status.guard';

type MockGetExistingSubscriptionUseCase = Pick<GetExistingSubscriptionUseCase, 'execute'>;

const createMockContext = (session: Record<string, unknown> | undefined): ExecutionContext =>
	({
		switchToHttp: () => ({
			getRequest: () => ({ session }),
		}),
		getHandler: () => jest.fn(),
		getClass: () => jest.fn(),
	}) as unknown as ExecutionContext;

describe('SubscriptionStatusGuard', () => {
	let guard: SubscriptionStatusGuard;
	let reflector: Reflector;
	let getExistingSubscriptionUseCase: jest.Mocked<MockGetExistingSubscriptionUseCase>;

	beforeEach(() => {
		reflector = new Reflector();
		getExistingSubscriptionUseCase = { execute: jest.fn() };
		guard = new SubscriptionStatusGuard(reflector, getExistingSubscriptionUseCase as unknown as GetExistingSubscriptionUseCase);
	});

	it('deve permitir acesso em rotas públicas', async () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(true);
		const context = createMockContext(undefined);

		await expect(guard.canActivate(context)).resolves.toBe(true);
	});

	it('deve permitir acesso em rotas não tenant-scoped', async () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false).mockReturnValueOnce(false);
		const context = createMockContext({ activeOrganizationId: 'org-1' });

		await expect(guard.canActivate(context)).resolves.toBe(true);
	});

	it('deve permitir acesso em rotas marcadas com @SkipSubscriptionGuard', async () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(true);
		const context = createMockContext({ activeOrganizationId: 'org-1' });

		await expect(guard.canActivate(context)).resolves.toBe(true);
		expect(getExistingSubscriptionUseCase.execute).not.toHaveBeenCalled();
	});

	it('deve permitir acesso quando não existe subscription pra organização (fail-open)', async () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(false);
		getExistingSubscriptionUseCase.execute.mockResolvedValue(null);
		const context = createMockContext({ activeOrganizationId: 'org-1' });

		await expect(guard.canActivate(context)).resolves.toBe(true);
	});

	it('deve permitir acesso quando a subscription está ACTIVE', async () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(false);
		getExistingSubscriptionUseCase.execute.mockResolvedValue({ status: SubscriptionStatus.ACTIVE } as never);
		const context = createMockContext({ activeOrganizationId: 'org-1' });

		await expect(guard.canActivate(context)).resolves.toBe(true);
	});

	it('deve permitir acesso quando a subscription está TRIALING', async () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(false);
		getExistingSubscriptionUseCase.execute.mockResolvedValue({ status: SubscriptionStatus.TRIALING } as never);
		const context = createMockContext({ activeOrganizationId: 'org-1' });

		await expect(guard.canActivate(context)).resolves.toBe(true);
	});

	it('deve bloquear com ForbiddenException quando a subscription está PAST_DUE', async () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(false);
		getExistingSubscriptionUseCase.execute.mockResolvedValue({ status: SubscriptionStatus.PAST_DUE } as never);
		const context = createMockContext({ activeOrganizationId: 'org-1' });

		await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
	});

	it('deve bloquear com ForbiddenException quando a subscription está EXPIRED', async () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(false);
		getExistingSubscriptionUseCase.execute.mockResolvedValue({ status: SubscriptionStatus.EXPIRED } as never);
		const context = createMockContext({ activeOrganizationId: 'org-1' });

		await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
	});
});
