import type { WebhookEvent } from '@abacatepay/types/v2';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import type { Subscription } from '../../models/entities/subscription.entity';
import type { AbacatePayWebhookEventsRepositoryInterface, SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ABACATE_PAY_WEBHOOK_EVENT_REPOSITORY_INTERFACE_KEY, SUBSCRIPTION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { BillingCycle } from '../../shared/enums/billing-cycle.enum';
import { SubscriptionStatus } from '../../shared/enums/subscription-status.enum';

const POSTGRES_UNIQUE_VIOLATION = '23505';
const ANNUAL_PERIOD_DAYS = 365;

interface WebhookCheckoutPayload {
	id?: string;
	externalId?: string | null;
	frequency?: string | null;
	status?: string;
}

interface SubscriptionEventData {
	subscription?: { id: string; currentPeriodEnd?: string; status?: string };
	checkout?: WebhookCheckoutPayload;
	billing?: WebhookCheckoutPayload;
	id?: string;
}

function extractCheckoutPayload(data: Record<string, unknown>): WebhookCheckoutPayload | null {
	const checkout = data.checkout;
	const billing = data.billing;
	if (checkout && typeof checkout === 'object') return checkout as WebhookCheckoutPayload;
	if (billing && typeof billing === 'object') return billing as WebhookCheckoutPayload;
	return null;
}

function isCheckoutCompletedEvent(event: WebhookEvent): boolean {
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
			const reprocessed = await this.reprocessIfStillTrialing(event);
			if (!reprocessed) {
				this.logger.log(`Webhook event ${event.id} (${event.event}) already processed, skipping`);
			}
			return;
		}

		if (isCheckoutCompletedEvent(event)) {
			await this.handleCheckoutCompleted(event);
			return;
		}

		await this.handleSubscriptionEvent(event);
	}

	// Eventos já registrados que falharam o lookup (bug bill_ vs subs_) ficam TRIALING pra sempre.
	// Se a AbacatePay reenviar o mesmo event_id e a linha local ainda estiver TRIALING, reprocessa.
	private async reprocessIfStillTrialing(event: WebhookEvent): Promise<boolean> {
		if (event.event !== 'subscription.completed' && event.event !== 'subscription.trial_started' && event.event !== 'subscription.renewed') {
			return false;
		}

		const data = event.data as SubscriptionEventData;
		const checkout = data.checkout ?? data.billing;
		const subscription = await this.findLocalSubscription({
			abacateSubscriptionId: data.subscription?.id ?? data.id,
			organizationId: checkout?.externalId ?? null,
			checkoutId: checkout?.id ?? null,
		});

		if (!subscription || subscription.status !== SubscriptionStatus.TRIALING) {
			return false;
		}

		this.logger.log(`Reprocessing ${event.event} ${event.id} — local subscription still TRIALING`);
		await this.handleSubscriptionEvent(event);
		return true;
	}

	private async handleCheckoutCompleted(event: WebhookEvent): Promise<void> {
		const checkout = extractCheckoutPayload(event.data as Record<string, unknown>);
		const organizationId = checkout?.externalId;
		if (!organizationId) {
			this.logger.warn(`checkout.completed without externalId (checkout ${checkout?.id ?? 'unknown'})`);
			return;
		}

		const subscription = await this.subscriptionsRepository.findOne({ where: { organization_id: organizationId } });
		if (!subscription) {
			this.logger.warn(`No local subscription for organization ${organizationId} (checkout ${checkout?.id})`);
			return;
		}

		if (checkout?.id) {
			subscription.abacate_checkout_id = checkout.id;
			if (subscription.abacate_subscription_id === checkout.id) {
				subscription.abacate_subscription_id = null;
			}
		}

		// Checkout de assinatura mensal (CARD) — a ativação e o subs_… vêm em subscription.completed.
		// Aqui só amarra o bill_… pra o próximo evento achar a linha local.
		if (checkout?.frequency === 'SUBSCRIPTION') {
			await this.subscriptionsRepository.save(subscription);
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
		const checkout = data.checkout ?? data.billing;

		if (!abacateSubscriptionId && !checkout?.externalId && !checkout?.id) {
			this.logger.warn(`Webhook event without subscription/checkout id: ${event.event}`);
			return;
		}

		const subscription = await this.findLocalSubscription({
			abacateSubscriptionId,
			organizationId: checkout?.externalId ?? null,
			checkoutId: checkout?.id ?? null,
		});

		if (!subscription) {
			this.logger.warn(
				`No local subscription for AbacatePay event ${event.event} (subs=${abacateSubscriptionId}, org=${checkout?.externalId}, bill=${checkout?.id})`,
			);
			return;
		}

		switch (event.event) {
			case 'subscription.renewed':
			case 'subscription.completed':
			case 'subscription.trial_started':
				subscription.status = SubscriptionStatus.ACTIVE;
				if (abacateSubscriptionId) {
					subscription.abacate_subscription_id = abacateSubscriptionId;
				}
				if (checkout?.id) {
					subscription.abacate_checkout_id = checkout.id;
				}
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

	private async findLocalSubscription(args: {
		abacateSubscriptionId?: string;
		organizationId?: string | null;
		checkoutId?: string | null;
	}): Promise<Subscription | null> {
		if (args.abacateSubscriptionId) {
			const bySubsId = await this.subscriptionsRepository.findOne({
				where: { abacate_subscription_id: args.abacateSubscriptionId },
			});
			if (bySubsId) return bySubsId;
		}

		if (args.organizationId) {
			const byOrg = await this.subscriptionsRepository.findOne({
				where: { organization_id: args.organizationId },
			});
			if (byOrg) return byOrg;
		}

		if (args.checkoutId) {
			const byCheckout = await this.subscriptionsRepository.findOne({
				where: { abacate_checkout_id: args.checkoutId },
			});
			if (byCheckout) return byCheckout;

			// legado: bill_… gravado por engano em abacate_subscription_id
			return this.subscriptionsRepository.findOne({
				where: { abacate_subscription_id: args.checkoutId },
			});
		}

		return null;
	}

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
