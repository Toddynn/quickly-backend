import { Inject, Injectable } from '@nestjs/common';
import { GetExistingPlanUseCase } from '@/modules/plans/use-cases/get-existing-plan/get-existing-plan.use-case';
import { PlanLimitExceededException } from '../../errors/plan-limit-exceeded.error';
import { GetExistingSubscriptionUseCase } from '../get-existing-subscription/get-existing-subscription.use-case';

export type PlanLimitKey = 'professionals' | 'services';

const LIMIT_COLUMN_BY_KEY: Record<PlanLimitKey, 'max_professionals' | 'max_services'> = {
	professionals: 'max_professionals',
	services: 'max_services',
};

@Injectable()
export class EnforcePlanLimitUseCase {
	constructor(
		@Inject(GetExistingSubscriptionUseCase)
		private readonly getExistingSubscriptionUseCase: GetExistingSubscriptionUseCase,
		@Inject(GetExistingPlanUseCase)
		private readonly getExistingPlanUseCase: GetExistingPlanUseCase,
	) {}

	async execute(organizationId: string, limitKey: PlanLimitKey, currentCount: number): Promise<void> {
		const subscription = await this.getExistingSubscriptionUseCase.execute(
			{ where: { organization_id: organizationId } },
			{ throwIfNotFound: false },
		);
		if (!subscription) return;

		const plan = await this.getExistingPlanUseCase.execute({ where: { id: subscription.plan_id } });
		if (!plan) return;

		const limit = plan[LIMIT_COLUMN_BY_KEY[limitKey]];
		if (limit !== null && currentCount >= limit) {
			throw new PlanLimitExceededException(limitKey, limit);
		}
	}
}
