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

	it('deve ativar a assinatura em subscription.completed via checkout.externalId e gravar subs_', async () => {
		const subscription = {
			id: 'sub-1',
			status: SubscriptionStatus.TRIALING,
			abacate_subscription_id: 'bill_legacy',
			abacate_checkout_id: null,
		} as Subscription;
		subscriptionsRepository.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(subscription);

		await useCase.execute({
			id: 'evt-1',
			event: 'subscription.completed',
			devMode: true,
			data: {
				subscription: { id: 'subs_abc', status: 'ACTIVE' },
				checkout: {
					id: 'bill_abc',
					externalId: 'org-1',
					frequency: 'SUBSCRIPTION',
					status: 'PAID',
				},
			},
		} as never);

		expect(subscriptionsRepository.findOne).toHaveBeenCalledWith({ where: { abacate_subscription_id: 'subs_abc' } });
		expect(subscriptionsRepository.findOne).toHaveBeenCalledWith({ where: { organization_id: 'org-1' } });
		expect(subscription.status).toBe(SubscriptionStatus.ACTIVE);
		expect(subscription.abacate_subscription_id).toBe('subs_abc');
		expect(subscription.abacate_checkout_id).toBe('bill_abc');
		expect(subscriptionsRepository.save).toHaveBeenCalledWith(subscription);
	});

	it('deve achar a linha local pelo bill_ legado em abacate_subscription_id', async () => {
		const subscription = {
			id: 'sub-1',
			status: SubscriptionStatus.TRIALING,
			abacate_subscription_id: 'bill_abc',
			abacate_checkout_id: null,
		} as Subscription;
		subscriptionsRepository.findOne
			.mockResolvedValueOnce(null)
			.mockResolvedValueOnce(null)
			.mockResolvedValueOnce(subscription);

		await useCase.execute({
			id: 'evt-legacy',
			event: 'subscription.completed',
			devMode: true,
			data: {
				subscription: { id: 'subs_abc' },
				checkout: { id: 'bill_abc', externalId: null },
			},
		} as never);

		expect(subscription.abacate_subscription_id).toBe('subs_abc');
		expect(subscription.abacate_checkout_id).toBe('bill_abc');
		expect(subscription.status).toBe(SubscriptionStatus.ACTIVE);
	});

	it('deve só amarrar o checkout em checkout.completed com frequency SUBSCRIPTION (não ativa como anual)', async () => {
		const subscription = {
			id: 'sub-1',
			status: SubscriptionStatus.TRIALING,
			billing_cycle: BillingCycle.MONTHLY,
			abacate_checkout_id: null,
			abacate_subscription_id: null,
		} as Subscription;
		subscriptionsRepository.findOne.mockResolvedValue(subscription);

		await useCase.execute({
			id: 'evt-checkout-sub',
			event: 'checkout.completed',
			devMode: true,
			data: {
				checkout: {
					id: 'bill_abc',
					externalId: 'org-1',
					frequency: 'SUBSCRIPTION',
					status: 'PAID',
				},
			},
		} as never);

		expect(subscription.status).toBe(SubscriptionStatus.TRIALING);
		expect(subscription.billing_cycle).toBe(BillingCycle.MONTHLY);
		expect(subscription.abacate_checkout_id).toBe('bill_abc');
		expect(subscriptionsRepository.save).toHaveBeenCalledWith(subscription);
	});

	it('deve ativar a assinatura anual em checkout.completed ONE_TIME/Pix', async () => {
		const subscription = {
			id: 'sub-1',
			status: SubscriptionStatus.PAST_DUE,
			billing_cycle: BillingCycle.MONTHLY,
			last_renewal_reminder_days_before: 15,
			abacate_checkout_id: null,
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

	it('deve pular o processamento quando o evento já foi registrado e a assinatura não está TRIALING', async () => {
		const uniqueViolation = new QueryFailedError('insert', [], new Error('duplicate key')) as QueryFailedError & { code: string };
		uniqueViolation.code = '23505';
		webhookEventsRepository.insert.mockRejectedValue(uniqueViolation);
		subscriptionsRepository.findOne.mockResolvedValue({
			id: 'sub-1',
			status: SubscriptionStatus.ACTIVE,
		} as Subscription);

		await useCase.execute({
			id: 'evt-1',
			event: 'subscription.renewed',
			devMode: false,
			data: { subscription: { id: 'subs_abc' } },
		} as never);

		expect(subscriptionsRepository.save).not.toHaveBeenCalled();
	});

	it('deve reprocessar subscription.completed já registrado se a assinatura local ainda está TRIALING', async () => {
		const uniqueViolation = new QueryFailedError('insert', [], new Error('duplicate key')) as QueryFailedError & { code: string };
		uniqueViolation.code = '23505';
		webhookEventsRepository.insert.mockRejectedValue(uniqueViolation);

		const subscription = {
			id: 'sub-1',
			status: SubscriptionStatus.TRIALING,
			abacate_subscription_id: 'bill_abc',
			abacate_checkout_id: null,
		} as Subscription;
		subscriptionsRepository.findOne.mockResolvedValue(subscription);

		await useCase.execute({
			id: 'evt-stuck',
			event: 'subscription.completed',
			devMode: true,
			data: {
				subscription: { id: 'subs_abc' },
				checkout: { id: 'bill_abc', externalId: 'org-1' },
			},
		} as never);

		expect(subscription.status).toBe(SubscriptionStatus.ACTIVE);
		expect(subscription.abacate_subscription_id).toBe('subs_abc');
		expect(subscriptionsRepository.save).toHaveBeenCalledWith(subscription);
	});
});
