import type { PaymentMethod, RESTPostCreateSubscriptionBody } from '@abacatepay/types/v2';
import { Inject, Injectable } from '@nestjs/common';
import { AbacatePayService } from '@/modules/abacate-pay/abacate-pay.service';
import { GetExistingPlanUseCase } from '@/modules/plans/use-cases/get-existing-plan/get-existing-plan.use-case';
import { FRONT_END_URL } from '@/shared/constants/env-variables';
import type { Subscription } from '../../models/entities/subscription.entity';
import type { SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { SUBSCRIPTION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { SubscriptionStatus } from '../../shared/enums/subscription-status.enum';

const TRIAL_DAYS = 30;

interface SubscriptionCustomerInput {
	name: string;
	email: string;
	taxId: string;
	cellphone?: string;
}

interface SubscriptionCheckoutResponse {
	id: string;
	url: string;
}

@Injectable()
export class CreateSubscriptionUseCase {
	constructor(
		@Inject(SUBSCRIPTION_REPOSITORY_INTERFACE_KEY)
		private readonly subscriptionsRepository: SubscriptionsRepositoryInterface,
		@Inject(GetExistingPlanUseCase)
		private readonly getExistingPlanUseCase: GetExistingPlanUseCase,
		@Inject(AbacatePayService)
		private readonly abacatePayService: AbacatePayService,
	) {}

	async execute(organizationId: string, planId: string, customer: SubscriptionCustomerInput): Promise<{ subscription: Subscription; checkoutUrl: string }> {
		const plan = await this.getExistingPlanUseCase.execute({ where: { id: planId } });

		const abacateCustomer = await this.abacatePayService.createCustomer({
			name: customer.name,
			email: customer.email,
			taxId: customer.taxId,
			cellphone: customer.cellphone,
		});

		const trialEndsAt = new Date();
		trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DAYS);

		// POST /subscriptions/create cria um *checkout* (bill_…), não a assinatura (subs_…).
		// A assinatura só nasce depois do pagamento — ver webhook subscription.completed.
		// SDK type gap: `items` não está em RESTPostCreateSubscriptionBody (@abacatepay/types@3.0.3),
		// mas a API v2 exige; resposta real é Billing (id/url), tipada errado como APISubscription.
		const checkout = (await this.abacatePayService.createSubscription({
			amount: plan.price_cents,
			name: plan.name,
			externalId: organizationId,
			method: 'CARD' as PaymentMethod,
			frequency: { cycle: 'MONTHLY', dayOfProcessing: trialEndsAt.getDate() },
			customerId: abacateCustomer.id,
			retryPolicy: { maxRetry: 3, retryEvery: 3 },
			items: [{ id: plan.abacate_product_id, quantity: 1 }],
			returnUrl: `${FRONT_END_URL}/subscribe`,
			completionUrl: `${FRONT_END_URL}/subscribe`,
		} as RESTPostCreateSubscriptionBody & {
			items: { id: string; quantity: number }[];
			returnUrl: string;
			completionUrl: string;
		})) as unknown as SubscriptionCheckoutResponse;

		const subscription = this.subscriptionsRepository.create({
			organization_id: organizationId,
			plan_id: plan.id,
			status: SubscriptionStatus.TRIALING,
			abacate_customer_id: abacateCustomer.id,
			abacate_checkout_id: checkout.id,
			abacate_subscription_id: null,
			trial_ends_at: trialEndsAt,
		});
		await this.subscriptionsRepository.save(subscription);

		return { subscription, checkoutUrl: checkout.url };
	}
}
