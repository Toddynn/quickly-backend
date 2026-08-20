import type { SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { BillingCycle } from '../../shared/enums/billing-cycle.enum';
import { SubscriptionStatus } from '../../shared/enums/subscription-status.enum';
import { ExpireStaleSubscriptionsUseCase } from './expire-stale-subscriptions.use-case';

type MockRepository = Pick<SubscriptionsRepositoryInterface, 'update'>;

describe('ExpireStaleSubscriptionsUseCase', () => {
	let repository: jest.Mocked<MockRepository>;
	let useCase: ExpireStaleSubscriptionsUseCase;

	beforeEach(() => {
		repository = { update: jest.fn().mockResolvedValue({ affected: 0, raw: [], generatedMaps: [] }) };
		useCase = new ExpireStaleSubscriptionsUseCase(repository as unknown as SubscriptionsRepositoryInterface);
	});

	it('deve marcar ACTIVE vencido como PAST_DUE independente do ciclo', async () => {
		await useCase.execute();

		expect(repository.update).toHaveBeenCalledWith(expect.objectContaining({ status: SubscriptionStatus.ACTIVE }), {
			status: SubscriptionStatus.PAST_DUE,
		});
	});

	it('deve usar janela de 9 dias pra expirar assinaturas PAST_DUE do ciclo MONTHLY', async () => {
		await useCase.execute();

		expect(repository.update).toHaveBeenCalledWith(
			expect.objectContaining({ status: SubscriptionStatus.PAST_DUE, billing_cycle: BillingCycle.MONTHLY }),
			{ status: SubscriptionStatus.EXPIRED },
		);
	});

	it('deve usar janela de 5 dias (mais curta) pra expirar assinaturas PAST_DUE do ciclo ANNUAL', async () => {
		await useCase.execute();

		expect(repository.update).toHaveBeenCalledWith(expect.objectContaining({ status: SubscriptionStatus.PAST_DUE, billing_cycle: BillingCycle.ANNUAL }), {
			status: SubscriptionStatus.EXPIRED,
		});
	});

	it('deve chamar update 3 vezes no total (1 PAST_DUE geral + 1 EXPIRED por ciclo)', async () => {
		await useCase.execute();

		expect(repository.update).toHaveBeenCalledTimes(3);
	});
});
