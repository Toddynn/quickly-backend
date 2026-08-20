import { Inject, Injectable } from '@nestjs/common';
import { AbacatePayService } from '@/modules/abacate-pay/abacate-pay.service';
import { GetExistingPlanUseCase } from '@/modules/plans/use-cases/get-existing-plan/get-existing-plan.use-case';
import type { SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { SUBSCRIPTION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { GetExistingSubscriptionUseCase } from '../get-existing-subscription/get-existing-subscription.use-case';

@Injectable()
export class CreateAnnualCheckoutUseCase {
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

		// Se existe uma assinatura recorrente de cartão ativa, cancela antes de vender o anual —
		// senão o cliente fica sendo cobrado nos dois ao mesmo tempo.
		if (subscription.abacate_subscription_id) {
			await this.abacatePayService.cancelSubscription(subscription.abacate_subscription_id);
			subscription.abacate_subscription_id = null;
		}

		const checkout = await this.abacatePayService.createCheckout({
			items: [{ id: plan.abacate_annual_product_id, quantity: 1 }],
			methods: ['PIX'],
			frequency: 'ONE_TIME',
			customerId: subscription.abacate_customer_id ?? undefined,
			externalId: organizationId,
		});

		await this.subscriptionsRepository.save(subscription);

		return { checkoutUrl: checkout.url };
	}
}
