import type { AbacatePayService } from '@/modules/abacate-pay/abacate-pay.service';
import type { GetExistingPlanUseCase } from '@/modules/plans/use-cases/get-existing-plan/get-existing-plan.use-case';
import type { Subscription } from '../../models/entities/subscription.entity';
import type { SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { BillingCycle } from '../../shared/enums/billing-cycle.enum';
import { SubscriptionStatus } from '../../shared/enums/subscription-status.enum';
import type { GetExistingSubscriptionUseCase } from '../get-existing-subscription/get-existing-subscription.use-case';
import { CreateSubscriptionCheckoutUseCase } from './create-subscription-checkout.use-case';

type MockRepository = Pick<SubscriptionsRepositoryInterface, 'save'>;
type MockGetExistingSubscriptionUseCase = Pick<GetExistingSubscriptionUseCase, 'execute'>;
type MockGetExistingPlanUseCase = Pick<GetExistingPlanUseCase, 'execute'>;
type MockAbacatePayService = Pick<AbacatePayService, 'createSubscription' | 'cancelSubscription'>;

const createSubscriptionFixture = (overrides: Partial<Subscription> = {}): Subscription =>
	({
		id: 'sub-1',
		organization_id: 'org-1',
		plan_id: 'plan-1',
		status: SubscriptionStatus.TRIALING,
		abacate_customer_id: 'cust-1',
		abacate_subscription_id: 'subs_old',
		abacate_checkout_id: 'bill_old',
		billing_cycle: BillingCycle.MONTHLY,
		trial_ends_at: null,
		...overrides,
	}) as Subscription;

describe('CreateSubscriptionCheckoutUseCase', () => {
	let subscriptionsRepository: jest.Mocked<MockRepository>;
	let getExistingSubscriptionUseCase: jest.Mocked<MockGetExistingSubscriptionUseCase>;
	let getExistingPlanUseCase: jest.Mocked<MockGetExistingPlanUseCase>;
	let abacatePayService: jest.Mocked<MockAbacatePayService>;
	let useCase: CreateSubscriptionCheckoutUseCase;

	beforeEach(() => {
		subscriptionsRepository = { save: jest.fn() };
		getExistingSubscriptionUseCase = { execute: jest.fn() };
		getExistingPlanUseCase = { execute: jest.fn() };
		abacatePayService = { createSubscription: jest.fn(), cancelSubscription: jest.fn() };

		useCase = new CreateSubscriptionCheckoutUseCase(
			subscriptionsRepository as unknown as SubscriptionsRepositoryInterface,
			getExistingSubscriptionUseCase as unknown as GetExistingSubscriptionUseCase,
			getExistingPlanUseCase as unknown as GetExistingPlanUseCase,
			abacatePayService as unknown as AbacatePayService,
		);
	});

	it('deve cancelar a assinatura órfã (subs_) e criar um novo checkout gravando bill_', async () => {
		const trialEndsAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 10);
		const subscription = createSubscriptionFixture({ trial_ends_at: trialEndsAt });
		getExistingSubscriptionUseCase.execute.mockResolvedValue(subscription);
		getExistingPlanUseCase.execute.mockResolvedValue({ id: 'plan-1', price_cents: 5000, name: 'SOLO', abacate_product_id: 'prod_1' } as never);
		abacatePayService.createSubscription.mockResolvedValue({ id: 'bill_new', url: 'https://pay.abacatepay.com/bill_new' } as never);

		const result = await useCase.execute('org-1');

		expect(abacatePayService.cancelSubscription).toHaveBeenCalledWith('subs_old');
		expect(abacatePayService.createSubscription).toHaveBeenCalledWith(
			expect.objectContaining({
				amount: 5000,
				name: 'SOLO',
				externalId: 'org-1',
				method: 'CARD',
				customerId: 'cust-1',
				frequency: { cycle: 'MONTHLY', dayOfProcessing: trialEndsAt.getDate() },
			}),
		);
		expect(subscription.abacate_subscription_id).toBeNull();
		expect(subscription.abacate_checkout_id).toBe('bill_new');
		expect(subscriptionsRepository.save).toHaveBeenCalledWith(subscription);
		expect(result).toEqual({ checkoutUrl: 'https://pay.abacatepay.com/bill_new' });
	});

	it('não deve chamar cancelSubscription quando o id local é bill_ legado', async () => {
		const subscription = createSubscriptionFixture({ abacate_subscription_id: 'bill_legacy', abacate_checkout_id: null });
		getExistingSubscriptionUseCase.execute.mockResolvedValue(subscription);
		getExistingPlanUseCase.execute.mockResolvedValue({ id: 'plan-1', price_cents: 5000, name: 'SOLO', abacate_product_id: 'prod_1' } as never);
		abacatePayService.createSubscription.mockResolvedValue({ id: 'bill_new', url: 'https://pay.abacatepay.com/bill_new' } as never);

		await useCase.execute('org-1');

		expect(abacatePayService.cancelSubscription).not.toHaveBeenCalled();
		expect(subscription.abacate_subscription_id).toBeNull();
		expect(subscription.abacate_checkout_id).toBe('bill_new');
	});

	it('deve cobrar a partir de hoje quando o trial já venceu (reativação de PAST_DUE/EXPIRED)', async () => {
		const trialEndsAt = new Date(Date.now() - 1000 * 60 * 60 * 24 * 5);
		const subscription = createSubscriptionFixture({ status: SubscriptionStatus.PAST_DUE, trial_ends_at: trialEndsAt });
		getExistingSubscriptionUseCase.execute.mockResolvedValue(subscription);
		getExistingPlanUseCase.execute.mockResolvedValue({ id: 'plan-1', price_cents: 5000, name: 'SOLO', abacate_product_id: 'prod_1' } as never);
		abacatePayService.createSubscription.mockResolvedValue({ id: 'bill_new', url: 'https://pay.abacatepay.com/bill_new' } as never);

		await useCase.execute('org-1');

		expect(abacatePayService.createSubscription).toHaveBeenCalledWith(
			expect.objectContaining({
				frequency: { cycle: 'MONTHLY', dayOfProcessing: new Date().getDate() },
			}),
		);
	});
});
