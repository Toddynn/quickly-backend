import { Inject, Injectable, Logger } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import type { AbacatePayWebhookEventsRepositoryInterface, SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ABACATE_PAY_WEBHOOK_EVENT_REPOSITORY_INTERFACE_KEY, SUBSCRIPTION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { SubscriptionStatus } from '../../shared/enums/subscription-status.enum';

const POSTGRES_UNIQUE_VIOLATION = '23505';

interface AbacatePayWebhookEvent {
	id: string;
	event: string;
	data: { id?: string; subscription?: { id: string; currentPeriodEnd?: string } };
}

@Injectable()
export class HandleAbacatePayWebhookUseCase {
	private readonly logger = new Logger(HandleAbacatePayWebhookUseCase.name);

	constructor(
		@Inject(SUBSCRIPTION_REPOSITORY_INTERFACE_KEY)
		private readonly subscriptionsRepository: SubscriptionsRepositoryInterface,
		@Inject(ABACATE_PAY_WEBHOOK_EVENT_REPOSITORY_INTERFACE_KEY)
		private readonly webhookEventsRepository: AbacatePayWebhookEventsRepositoryInterface,
	) {}

	async execute(event: AbacatePayWebhookEvent): Promise<void> {
		const alreadyProcessed = await this.registerEvent(event);
		if (alreadyProcessed) {
			this.logger.log(`Webhook event ${event.id} (${event.event}) already processed, skipping`);
			return;
		}

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
				if (subscription.status !== SubscriptionStatus.CANCELED) {
					subscription.status = SubscriptionStatus.CANCELED;
					subscription.canceled_at = new Date();
				}
				break;
			default:
				this.logger.log(`Unhandled webhook event: ${event.event}`);
				return;
		}

		await this.subscriptionsRepository.save(subscription);
	}

	/**
	 * Insere o evento antes de processar — se já existir (retry de entrega da AbacatePay),
	 * a constraint única em `event_id` rejeita o insert e sinaliza "já processado".
	 */
	private async registerEvent(event: AbacatePayWebhookEvent): Promise<boolean> {
		try {
			await this.webhookEventsRepository.insert({ event_id: event.id, event_type: event.event });
			return false;
		} catch (error) {
			if (error instanceof QueryFailedError && (error as unknown as { code?: string }).code === POSTGRES_UNIQUE_VIOLATION) {
				return true;
			}
			throw error;
		}
	}
}
