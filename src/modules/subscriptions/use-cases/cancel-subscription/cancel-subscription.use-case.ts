import { Inject, Injectable } from '@nestjs/common';
import { AbacatePayService } from '@/modules/abacate-pay/abacate-pay.service';
import type { Subscription } from '../../models/entities/subscription.entity';
import type { SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { SUBSCRIPTION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { SubscriptionStatus } from '../../shared/enums/subscription-status.enum';
import { isAbacateSubscriptionId } from '../../shared/functions/is-abacate-subscription-id';
import { GetExistingSubscriptionUseCase } from '../get-existing-subscription/get-existing-subscription.use-case';

@Injectable()
export class CancelSubscriptionUseCase {
	constructor(
		@Inject(SUBSCRIPTION_REPOSITORY_INTERFACE_KEY)
		private readonly subscriptionsRepository: SubscriptionsRepositoryInterface,
		@Inject(GetExistingSubscriptionUseCase)
		private readonly getExistingSubscriptionUseCase: GetExistingSubscriptionUseCase,
		@Inject(AbacatePayService)
		private readonly abacatePayService: AbacatePayService,
	) {}

	async execute(organizationId: string): Promise<Subscription> {
		const subscription = await this.getExistingSubscriptionUseCase.execute({ where: { organization_id: organizationId } });

		if (subscription.abacate_subscription_id && isAbacateSubscriptionId(subscription.abacate_subscription_id)) {
			await this.abacatePayService.cancelSubscription(subscription.abacate_subscription_id);
		}

		subscription.status = SubscriptionStatus.CANCELED;
		subscription.canceled_at = new Date();
		await this.subscriptionsRepository.save(subscription);
		return subscription;
	}
}
