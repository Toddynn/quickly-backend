import { QueryFailedError } from 'typeorm';
import type { Subscription } from '../../models/entities/subscription.entity';
import type { AbacatePayWebhookEventsRepositoryInterface, SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { BillingCycle } from '../../shared/enums/billing-cycle.enum';
import { SubscriptionStatus } from '../../shared/enums/subscription-status.enum';
import { HandleAbacatePayWebhookUseCase } from './handle-abacate-pay-webhook.use-case';

type MockSubscriptionsRepository = Pick<SubscriptionsRepositoryInterface, 'findOne' | 'save'>;
type MockWebhookEventsRepository = Pick<AbacatePayWebhookEventsRepositoryInterface, 'insert'>;

describe('HandleAbacatePayWebhookUseCase', () => {
	let subscriptionsRepository: jest.Mocked<MockSubscriptionsRepository>;
	let webhookEventsRepository: jest.Mocked<MockWebhookEventsRepository>;
	let useCase: HandleAbacatePayWebhookUseCase;

	beforeEach(() => {
		subscriptionsRepository = { findOne: jest.fn(), save: jest.fn() };
		webhookEventsRepository = { insert: jest.fn().mockResolvedValue(undefined) };
		useCase = new HandleAbacatePayWebhookUseCase(
			subscriptionsRepository as unknown as SubscriptionsRepositoryInterface,
			webhookEventsRepository as unknown as AbacatePayWebhookEventsRepositoryInterface,
		);
	});

	it('deve ativar a assinatura em subscription.renewed e atualizar current_period_end', async () => {
		const subscription = { id: 'sub-1', status: SubscriptionStatus.PAST_DUE } as Subscription;
		subscriptionsRepository.findOne.mockResolvedValue(subscription);

		await useCase.execute({
			id: 'evt-1',
			event: 'subscription.renewed',
			devMode: false,
			data: { subscription: { id: 'abacate-sub-1', currentPeriodEnd: '2027-01-01T00:00:00.000Z' } },
		} as never);

		expect(subscription.status).toBe(SubscriptionStatus.ACTIVE);
		expect(subscription.current_period_end).toEqual(new Date('2027-01-01T00:00:00.000Z'));
		expect(subscriptionsRepository.save).toHaveBeenCalledWith(subscription);
	});

	it('deve ativar a assinatura anual em checkout.completed, marcar billing_cycle ANNUAL e setar current_period_end +365 dias', async () => {
		const subscription = {
			id: 'sub-1',
			status: SubscriptionStatus.PAST_DUE,
			billing_cycle: BillingCycle.MONTHLY,
			last_renewal_reminder_days_before: 15,
		} as Subscription;
		subscriptionsRepository.findOne.mockResolvedValue(subscription);

		await useCase.execute({
			id: 'evt-2',
			event: 'checkout.completed',
			devMode: false,
			data: {
				payment: { amount: 39900, fee: 80, method: 'PIX' },
				billing: { amount: 39900, id: 'checkout_1', externalId: 'org-1', status: 'PAID', url: 'https://pay.abacatepay.com/checkout_1' },
			},
		} as never);

		expect(subscriptionsRepository.findOne).toHaveBeenCalledWith({ where: { organization_id: 'org-1' } });
		expect(subscription.status).toBe(SubscriptionStatus.ACTIVE);
		expect(subscription.billing_cycle).toBe(BillingCycle.ANNUAL);
		expect(subscription.last_renewal_reminder_days_before).toBeNull();
		expect(subscription.current_period_end?.getTime()).toBeGreaterThan(Date.now() + 360 * 24 * 60 * 60 * 1000);
		expect(subscriptionsRepository.save).toHaveBeenCalledWith(subscription);
	});

	it('não deve quebrar quando checkout.completed referencia uma organização sem subscription local', async () => {
		subscriptionsRepository.findOne.mockResolvedValue(null);

		await useCase.execute({
			id: 'evt-3',
			event: 'checkout.completed',
			devMode: false,
			data: {
				payment: { amount: 39900, fee: 80, method: 'PIX' },
				billing: { amount: 39900, id: 'checkout_2', externalId: 'org-unknown', status: 'PAID', url: 'https://pay.abacatepay.com/checkout_2' },
			},
		} as never);

		expect(subscriptionsRepository.save).not.toHaveBeenCalled();
	});

	it('deve pular o processamento quando o evento já foi registrado antes (idempotência)', async () => {
		const uniqueViolation = new QueryFailedError('insert', [], new Error('duplicate key')) as QueryFailedError & { code: string };
		uniqueViolation.code = '23505';
		webhookEventsRepository.insert.mockRejectedValue(uniqueViolation);

		await useCase.execute({
			id: 'evt-1',
			event: 'subscription.renewed',
			devMode: false,
			data: { subscription: { id: 'abacate-sub-1' } },
		} as never);

		expect(subscriptionsRepository.findOne).not.toHaveBeenCalled();
	});
});
