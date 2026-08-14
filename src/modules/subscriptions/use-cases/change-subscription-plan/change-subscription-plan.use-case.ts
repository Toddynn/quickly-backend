import { Inject, Injectable } from '@nestjs/common';
import { AbacatePayService } from '@/modules/abacate-pay/abacate-pay.service';
import type { Plan } from '@/modules/plans/models/entities/plan.entity';
import type { PlansRepositoryInterface } from '@/modules/plans/models/interfaces/repository.interface';
import { PLAN_REPOSITORY_INTERFACE_KEY } from '@/modules/plans/shared/constants/repository-interface-key';
import { GetExistingPlanUseCase } from '@/modules/plans/use-cases/get-existing-plan/get-existing-plan.use-case';
import type { Subscription } from '../../models/entities/subscription.entity';
import type { SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { SUBSCRIPTION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { GetExistingSubscriptionUseCase } from '../get-existing-subscription/get-existing-subscription.use-case';

@Injectable()
export class ChangeSubscriptionPlanUseCase {
	constructor(
		@Inject(SUBSCRIPTION_REPOSITORY_INTERFACE_KEY)
		private readonly subscriptionsRepository: SubscriptionsRepositoryInterface,
		@Inject(PLAN_REPOSITORY_INTERFACE_KEY)
		private readonly plansRepository: PlansRepositoryInterface,
		@Inject(GetExistingSubscriptionUseCase)
		private readonly getExistingSubscriptionUseCase: GetExistingSubscriptionUseCase,
		@Inject(GetExistingPlanUseCase)
		private readonly getExistingPlanUseCase: GetExistingPlanUseCase,
		@Inject(AbacatePayService)
		private readonly abacatePayService: AbacatePayService,
	) {}

	async execute(organizationId: string, newPlanId: string): Promise<Subscription> {
		const subscription = await this.getExistingSubscriptionUseCase.execute({ where: { organization_id: organizationId } });
		const newPlan = await this.getExistingPlanUseCase.execute({ where: { id: newPlanId } });

		if (subscription.abacate_subscription_id) {
			const abacateProductId = await this.ensureAbacateProduct(newPlan);
			await this.abacatePayService.changePlan(subscription.abacate_subscription_id, {
				productId: abacateProductId,
				quantity: 1,
			});
		}

		subscription.plan_id = newPlan.id;
		await this.subscriptionsRepository.save(subscription);
		return subscription;
	}

	// A AbacatePay exige um Product cadastrado (com billing cycle) só para o fluxo de change-plan
	// (subscriptions.create aceita amount/name direto, mas subscriptions.changePlan exige productId).
	// Criado sob demanda na primeira troca de plano e cacheado em Plan.abacate_product_id.
	private async ensureAbacateProduct(plan: Plan): Promise<string> {
		if (plan.abacate_product_id) return plan.abacate_product_id;

		// SDK type gap: `cycle` é aceito pela API (necessário para uso em change-plan) mas não está
		// declarado em RESTPostCreateProductBody@3.0.3 — ver Constraint 3 do plano.
		const product = await this.abacatePayService.createProduct({
			externalId: plan.key,
			name: plan.name,
			price: plan.price_cents,
			currency: 'BRL',
			cycle: 'MONTHLY',
		} as Parameters<AbacatePayService['createProduct']>[0]);

		plan.abacate_product_id = product.id;
		await this.plansRepository.save(plan);

		return product.id;
	}
}
