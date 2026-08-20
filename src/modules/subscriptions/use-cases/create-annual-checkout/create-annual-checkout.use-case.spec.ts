import type { AbacatePayService } from '@/modules/abacate-pay/abacate-pay.service';
import type { GetExistingPlanUseCase } from '@/modules/plans/use-cases/get-existing-plan/get-existing-plan.use-case';
import type { Subscription } from '../../models/entities/subscription.entity';
import type { SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { BillingCycle } from '../../shared/enums/billing-cycle.enum';
import { SubscriptionStatus } from '../../shared/enums/subscription-status.enum';
import type { GetExistingSubscriptionUseCase } from '../get-existing-subscription/get-existing-subscription.use-case';
import { CreateAnnualCheckoutUseCase } from './create-annual-checkout.use-case';

type MockRepository = Pick<SubscriptionsRepositoryInterface, 'save'>;
type MockGetExistingSubscriptionUseCase = Pick<GetExistingSubscriptionUseCase, 'execute'>;
type MockGetExistingPlanUseCase = Pick<GetExistingPlanUseCase, 'execute'>;
type MockAbacatePayService = Pick<AbacatePayService, 'createCheckout' | 'cancelSubscription'>;

const createSubscriptionFixture = (overrides: Partial<Subscription> = {}): Subscription =>
	({
		id: 'sub-1',
		organization_id: 'org-1',
		plan_id: 'plan-1',
		status: SubscriptionStatus.ACTIVE,
		abacate_customer_id: 'cust-1',
		abacate_subscription_id: 'abacate-sub-1',
		billing_cycle: BillingCycle.MONTHLY,
		...overrides,
	}) as Subscription;

describe('CreateAnnualCheckoutUseCase', () => {
	let subscriptionsRepository: jest.Mocked<MockRepository>;
	let getExistingSubscriptionUseCase: jest.Mocked<MockGetExistingSubscriptionUseCase>;
	let getExistingPlanUseCase: jest.Mocked<MockGetExistingPlanUseCase>;
	let abacatePayService: jest.Mocked<MockAbacatePayService>;
	let useCase: CreateAnnualCheckoutUseCase;

	beforeEach(() => {
		subscriptionsRepository = { save: jest.fn() };
		getExistingSubscriptionUseCase = { execute: jest.fn() };
		getExistingPlanUseCase = { execute: jest.fn() };
		abacatePayService = { createCheckout: jest.fn(), cancelSubscription: jest.fn() };

		useCase = new CreateAnnualCheckoutUseCase(
			subscriptionsRepository as unknown as SubscriptionsRepositoryInterface,
			getExistingSubscriptionUseCase as unknown as GetExistingSubscriptionUseCase,
			getExistingPlanUseCase as unknown as GetExistingPlanUseCase,
			abacatePayService as unknown as AbacatePayService,
		);
	});

	it('deve cancelar a subscription mensal existente e criar um checkout avulso Pix referenciando o produto anual', async () => {
		const subscription = createSubscriptionFixture();
		getExistingSubscriptionUseCase.execute.mockResolvedValue(subscription);
		getExistingPlanUseCase.execute.mockResolvedValue({ id: 'plan-1', abacate_annual_product_id: 'prod_annual_1' } as never);
		abacatePayService.createCheckout.mockResolvedValue({ url: 'https://pay.abacatepay.com/checkout_annual_1' } as never);

		const result = await useCase.execute('org-1');

		expect(abacatePayService.cancelSubscription).toHaveBeenCalledWith('abacate-sub-1');
		expect(abacatePayService.createCheckout).toHaveBeenCalledWith({
			items: [{ id: 'prod_annual_1', quantity: 1 }],
			methods: ['PIX'],
			frequency: 'ONE_TIME',
			customerId: 'cust-1',
			externalId: 'org-1',
		});
		expect(subscription.abacate_subscription_id).toBeNull();
		expect(subscriptionsRepository.save).toHaveBeenCalledWith(subscription);
		expect(result).toEqual({ checkoutUrl: 'https://pay.abacatepay.com/checkout_annual_1' });
	});

	it('não deve chamar cancelSubscription quando não há assinatura recorrente ativa na AbacatePay', async () => {
		const subscription = createSubscriptionFixture({ abacate_subscription_id: null });
		getExistingSubscriptionUseCase.execute.mockResolvedValue(subscription);
		getExistingPlanUseCase.execute.mockResolvedValue({ id: 'plan-1', abacate_annual_product_id: 'prod_annual_1' } as never);
		abacatePayService.createCheckout.mockResolvedValue({ url: 'https://pay.abacatepay.com/checkout_annual_1' } as never);

		await useCase.execute('org-1');

		expect(abacatePayService.cancelSubscription).not.toHaveBeenCalled();
	});
});
