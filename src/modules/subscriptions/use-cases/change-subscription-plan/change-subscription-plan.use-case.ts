import { Inject, Injectable } from '@nestjs/common';
import { AbacatePayService } from '@/modules/abacate-pay/abacate-pay.service';
import { GetExistingPlanUseCase } from '@/modules/plans/use-cases/get-existing-plan/get-existing-plan.use-case';
import type { Subscription } from '../../models/entities/subscription.entity';
import type { SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { SUBSCRIPTION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { isAbacateSubscriptionId } from '../../shared/functions/is-abacate-subscription-id';
import { GetExistingSubscriptionUseCase } from '../get-existing-subscription/get-existing-subscription.use-case';

@Injectable()
export class ChangeSubscriptionPlanUseCase {
	constructor(
		@Inject(SUBSCRIPTION_REPOSITORY_INTERFACE_KEY)
		private readonly subscriptionsRepository: SubscriptionsRepositoryInterface,
		@Inject(GetExistingPlanUseCase)
		private readonly getExistingPlanUseCase: GetExistingPlanUseCase,
		@Inject(GetExistingSubscriptionUseCase)
		private readonly getExistingSubscriptionUseCase: GetExistingSubscriptionUseCase,
		@Inject(AbacatePayService)
		private readonly abacatePayService: AbacatePayService,
	) {}

	async execute(organizationId: string, newPlanId: string): Promise<Subscription> {
		const subscription = await this.getExistingSubscriptionUseCase.execute({ where: { organization_id: organizationId } });
		const newPlan = await this.getExistingPlanUseCase.execute({ where: { id: newPlanId } });

		if (subscription.abacate_subscription_id && isAbacateSubscriptionId(subscription.abacate_subscription_id)) {
			await this.abacatePayService.changePlan(subscription.abacate_subscription_id, {
				productId: newPlan.abacate_product_id,
				quantity: 1,
			});
		}

		subscription.plan_id = newPlan.id;
		await this.subscriptionsRepository.save(subscription);
		return subscription;
	}
}
