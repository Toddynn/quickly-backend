import { Inject, Injectable } from '@nestjs/common';
import type { Subscription } from '../../models/entities/subscription.entity';
import { GetExistingSubscriptionUseCase } from '../get-existing-subscription/get-existing-subscription.use-case';

@Injectable()
export class GetOrganizationSubscriptionUseCase {
	constructor(
		@Inject(GetExistingSubscriptionUseCase)
		private readonly getExistingSubscriptionUseCase: GetExistingSubscriptionUseCase,
	) {}

	async execute(organizationId: string): Promise<Subscription> {
		return this.getExistingSubscriptionUseCase.execute({ where: { organization_id: organizationId } });
	}
}
