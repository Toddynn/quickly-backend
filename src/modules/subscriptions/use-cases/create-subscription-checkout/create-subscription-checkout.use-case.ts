import type { PaymentMethod, RESTPostCreateSubscriptionBody } from '@abacatepay/types/v2';
import { Inject, Injectable } from '@nestjs/common';
import { AbacatePayService } from '@/modules/abacate-pay/abacate-pay.service';
import { GetExistingPlanUseCase } from '@/modules/plans/use-cases/get-existing-plan/get-existing-plan.use-case';
import { FRONT_END_URL } from '@/shared/constants/env-variables';
import type { SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { SUBSCRIPTION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { isAbacateCheckoutId, isAbacateSubscriptionId } from '../../shared/functions/is-abacate-subscription-id';
import { GetExistingSubscriptionUseCase } from '../get-existing-subscription/get-existing-subscription.use-case';

interface SubscriptionCheckoutResponse {
	id: string;
	url: string;
}

@Injectable()
export class CreateSubscriptionCheckoutUseCase {
	constructor(
		@Inject(SUBSCRIPTION_REPOSITORY_INTERFACE_KEY)
		private readonly subscriptionsRepository: SubscriptionsRepositoryInterface,
		@Inject(GetExistingSubscriptionUseCase)
		private readonly getExistingSubscriptionUseCase: GetExistingSubscriptionUseCase,
		@Inject(GetExistingPlanUseCase)
		private readonly getExistingPlanUseCase: GetExistingPlanUseCase,
		@Inject(AbacatePayService)
		private readonly abacatePayService: AbacatePayService,
	) {}

	async execute(organizationId: string): Promise<{ checkoutUrl: string }> {
		const subscription = await this.getExistingSubscriptionUseCase.execute({ where: { organization_id: organizationId } });
		const plan = await this.getExistingPlanUseCase.execute({ where: { id: subscription.plan_id } });

		if (subscription.abacate_subscription_id && isAbacateSubscriptionId(subscription.abacate_subscription_id)) {
			await this.abacatePayService.cancelSubscription(subscription.abacate_subscription_id);
			subscription.abacate_subscription_id = null;
		} else if (subscription.abacate_subscription_id && isAbacateCheckoutId(subscription.abacate_subscription_id)) {
			subscription.abacate_checkout_id = subscription.abacate_subscription_id;
			subscription.abacate_subscription_id = null;
		}

		const now = new Date();
		const dayOfProcessing = subscription.trial_ends_at && subscription.trial_ends_at > now ? subscription.trial_ends_at.getDate() : now.getDate();

		const checkout = (await this.abacatePayService.createSubscription({
			amount: plan.price_cents,
			name: plan.name,
			externalId: organizationId,
			method: 'CARD' as PaymentMethod,
			frequency: { cycle: 'MONTHLY', dayOfProcessing },
			customerId: subscription.abacate_customer_id ?? undefined,
			retryPolicy: { maxRetry: 3, retryEvery: 3 },
			items: [{ id: plan.abacate_product_id, quantity: 1 }],
			returnUrl: `${FRONT_END_URL}/subscribe`,
			completionUrl: `${FRONT_END_URL}/subscribe`,
		} as RESTPostCreateSubscriptionBody & {
			items: { id: string; quantity: number }[];
			returnUrl: string;
			completionUrl: string;
		})) as unknown as SubscriptionCheckoutResponse;

		subscription.abacate_checkout_id = checkout.id;
		await this.subscriptionsRepository.save(subscription);

		return { checkoutUrl: checkout.url };
	}
}
