import { Inject, Injectable, Logger } from '@nestjs/common';
import type { SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { SUBSCRIPTION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { SubscriptionStatus } from '../../shared/enums/subscription-status.enum';

interface AbacatePayWebhookEvent {
	event: string;
	data: { id?: string; subscription?: { id: string; currentPeriodEnd?: string } };
}

@Injectable()
export class HandleAbacatePayWebhookUseCase {
	private readonly logger = new Logger(HandleAbacatePayWebhookUseCase.name);

	constructor(
		@Inject(SUBSCRIPTION_REPOSITORY_INTERFACE_KEY)
		private readonly subscriptionsRepository: SubscriptionsRepositoryInterface,
	) {}

	async execute(event: AbacatePayWebhookEvent): Promise<void> {
		const abacateSubscriptionId = event.data.subscription?.id ?? event.data.id;
		if (!abacateSubscriptionId) {
			this.logger.warn(`Webhook event without subscription id: ${event.event}`);
			return;
		}

		const subscription = await this.subscriptionsRepository.findOne({ where: { abacate_subscription_id: abacateSubscriptionId } });
		if (!subscription) {
			this.logger.warn(`No local subscription for AbacatePay subscription ${abacateSubscriptionId}`);
			return;
		}

		switch (event.event) {
			case 'subscription.renewed':
			case 'subscription.completed':
				subscription.status = SubscriptionStatus.ACTIVE;
				if (event.data.subscription?.currentPeriodEnd) {
					subscription.current_period_end = new Date(event.data.subscription.currentPeriodEnd);
				}
				break;
			case 'subscription.cancelled':
				subscription.status = SubscriptionStatus.CANCELED;
				subscription.canceled_at = new Date();
				break;
			default:
				this.logger.log(`Unhandled webhook event: ${event.event}`);
				return;
		}

		await this.subscriptionsRepository.save(subscription);
	}
}
