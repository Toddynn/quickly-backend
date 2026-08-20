import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LessThanOrEqual } from 'typeorm';
import { SendEmailUseCase } from '@/modules/email/use-cases/send-email/send-email.use-case';
import type { Subscription } from '../../models/entities/subscription.entity';
import type { SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { SUBSCRIPTION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { BillingCycle } from '../../shared/enums/billing-cycle.enum';
import { SubscriptionStatus } from '../../shared/enums/subscription-status.enum';

// Ordem ascendente é essencial: pra N dias restantes, queremos o MENOR threshold que ainda cobre
// esse valor (ex: 10 dias restantes -> 15, não 30) — ver a lógica de `find` abaixo.
const REMINDER_THRESHOLDS_DAYS = [3, 15, 30] as const;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class SendRenewalReminderEmailsUseCase {
	private readonly logger = new Logger(SendRenewalReminderEmailsUseCase.name);

	constructor(
		@Inject(SUBSCRIPTION_REPOSITORY_INTERFACE_KEY)
		private readonly subscriptionsRepository: SubscriptionsRepositoryInterface,
		@Inject(SendEmailUseCase)
		private readonly sendEmailUseCase: SendEmailUseCase,
	) {}

	@Cron(CronExpression.EVERY_DAY_AT_8AM)
	async execute(): Promise<void> {
		const now = new Date();
		const farthestThreshold = Math.max(...REMINDER_THRESHOLDS_DAYS);
		const withinWindow = new Date(now.getTime() + farthestThreshold * MS_PER_DAY);

		const candidates = await this.subscriptionsRepository.find({
			where: { status: SubscriptionStatus.ACTIVE, billing_cycle: BillingCycle.ANNUAL, current_period_end: LessThanOrEqual(withinWindow) },
			relations: { organization: { owner: true }, plan: true },
		});

		for (const subscription of candidates) {
			await this.maybeSendReminder(subscription, now);
		}
	}

	private async maybeSendReminder(subscription: Subscription, now: Date): Promise<void> {
		if (!subscription.current_period_end) return;

		const daysRemaining = Math.ceil((subscription.current_period_end.getTime() - now.getTime()) / MS_PER_DAY);
		const dueThreshold = REMINDER_THRESHOLDS_DAYS.find((threshold) => daysRemaining <= threshold);
		if (dueThreshold === undefined) return;

		const alreadySentForThisOrTighter =
			subscription.last_renewal_reminder_days_before !== null && subscription.last_renewal_reminder_days_before <= dueThreshold;
		if (alreadySentForThisOrTighter) return;

		await this.sendEmailUseCase.execute({
			to: subscription.organization.owner.email,
			subject: `Sua assinatura anual do Quickly vence em ${daysRemaining} dia(s)`,
			html: this.buildReminderHtml(subscription.organization.name, subscription.plan.name, daysRemaining),
		});

		subscription.last_renewal_reminder_days_before = dueThreshold;
		await this.subscriptionsRepository.save(subscription);
		this.logger.log(`Sent ${dueThreshold}-day renewal reminder for subscription ${subscription.id}`);
	}

	private buildReminderHtml(organizationName: string, planName: string, daysRemaining: number): string {
		return `
			<!DOCTYPE html>
			<html lang="pt-BR">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Renovação do plano anual</title>
			</head>
			<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
					<h1 style="color: #2c3e50; margin-top: 0;">Sua assinatura vence em ${daysRemaining} dia(s)</h1>
					<p>Olá! O plano <strong>${planName}</strong> de <strong>${organizationName}</strong> no Quickly vence em ${daysRemaining} dia(s).</p>
					<p>Renove agora para não perder acesso ao sistema.</p>
					<p style="font-size: 12px; color: #999; margin-bottom: 0;">Se você já renovou, pode ignorar este email.</p>
				</div>
			</body>
			</html>
		`;
	}
}
