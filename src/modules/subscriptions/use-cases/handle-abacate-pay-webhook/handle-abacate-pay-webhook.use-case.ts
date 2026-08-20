import type { WebhookCheckoutCompletedEvent, WebhookEvent } from '@abacatepay/types/v2';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import type { AbacatePayWebhookEventsRepositoryInterface, SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ABACATE_PAY_WEBHOOK_EVENT_REPOSITORY_INTERFACE_KEY, SUBSCRIPTION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { BillingCycle } from '../../shared/enums/billing-cycle.enum';
import { SubscriptionStatus } from '../../shared/enums/subscription-status.enum';

const POSTGRES_UNIQUE_VIOLATION = '23505';
const ANNUAL_PERIOD_DAYS = 365;

// subscription.* não tem payload tipado de verdade em @abacatepay/types@3.0.3 (cai em WebhookUndocumentedEvent,
// data: Record<string, unknown>) — mantemos essa forma mínima manual só pra esses eventos específicos.
interface SubscriptionEventData {
	id?: string;
	subscription?: { id: string; currentPeriodEnd?: string };
}

// @abacatepay/types só declara export ESM (sem condição "require" no package.json) — igual o gotcha
// documentado pro @abacatepay/sdk em ARCHITECTURE.md. `import type` é seguro (some em build time),
// mas importar valores (enums, funções como isCheckoutCompletedWebhookEvent) quebra em runtime CJS.
// Por isso o guard abaixo é uma comparação de string, não a função exportada pela lib.
function isCheckoutCompletedEvent(event: WebhookEvent): event is WebhookCheckoutCompletedEvent {
	return event.event === 'checkout.completed';
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

	async execute(event: WebhookEvent): Promise<void> {
		const alreadyProcessed = await this.registerEvent(event);
		if (alreadyProcessed) {
			this.logger.log(`Webhook event ${event.id} (${event.event}) already processed, skipping`);
			return;
		}

		if (isCheckoutCompletedEvent(event)) {
			await this.handleCheckoutCompleted(event);
			return;
		}

		await this.handleSubscriptionEvent(event);
	}

	// O checkout avulso do plano anual dispara esse evento (não subscription.*) — não existe
	// subscription recorrente da AbacatePay pro anual, então o lookup é por externalId (= organizationId),
	// setado na criação do checkout em CreateAnnualCheckoutUseCase.
	private async handleCheckoutCompleted(event: WebhookCheckoutCompletedEvent): Promise<void> {
		const organizationId = event.data.billing.externalId;
		const subscription = await this.subscriptionsRepository.findOne({ where: { organization_id: organizationId } });
		if (!subscription) {
			this.logger.warn(`No local subscription for organization ${organizationId} (checkout ${event.data.billing.id})`);
			return;
		}

		const currentPeriodEnd = new Date();
		currentPeriodEnd.setDate(currentPeriodEnd.getDate() + ANNUAL_PERIOD_DAYS);

		subscription.billing_cycle = BillingCycle.ANNUAL;
		subscription.status = SubscriptionStatus.ACTIVE;
		subscription.current_period_end = currentPeriodEnd;
		subscription.last_renewal_reminder_days_before = null;
		await this.subscriptionsRepository.save(subscription);
	}

	private async handleSubscriptionEvent(event: WebhookEvent): Promise<void> {
		const data = event.data as SubscriptionEventData;
		const abacateSubscriptionId = data.subscription?.id ?? data.id;
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
				if (data.subscription?.currentPeriodEnd) {
					subscription.current_period_end = new Date(data.subscription.currentPeriodEnd);
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
	private async registerEvent(event: WebhookEvent): Promise<boolean> {
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
