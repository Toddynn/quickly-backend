import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LessThan } from 'typeorm';
import type { SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { SUBSCRIPTION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { BillingCycle } from '../../shared/enums/billing-cycle.enum';
import { SubscriptionStatus } from '../../shared/enums/subscription-status.enum';

// AbacatePay não avisa cobrança falha por webhook — só `subscription.renewed` (sucesso) ou
// `subscription.cancelled` (terminal). PAST_DUE/EXPIRED só existem via essa varredura.
//
// MONTHLY (cartão): a AbacatePay tenta recobrar via retryPolicy (maxRetry: 3, retryEvery: 3 dias,
// configurado em create-subscription.use-case) antes de desistir — daí os 9 dias.
// ANNUAL (Pix avulso): não existe retry, é pagamento manual único — a carência é decisão de negócio
// pura, só pra dar folga caso o dono demore a perceber/pagar antes do bloqueio de acesso.
const EXPIRE_AFTER_PAST_DUE_DAYS: Record<BillingCycle, number> = {
	[BillingCycle.MONTHLY]: 9,
	[BillingCycle.ANNUAL]: 5,
};

@Injectable()
export class ExpireStaleSubscriptionsUseCase {
	private readonly logger = new Logger(ExpireStaleSubscriptionsUseCase.name);

	constructor(
		@Inject(SUBSCRIPTION_REPOSITORY_INTERFACE_KEY)
		private readonly subscriptionsRepository: SubscriptionsRepositoryInterface,
	) {}

	@Cron(CronExpression.EVERY_DAY_AT_3AM)
	async execute(): Promise<void> {
		const now = new Date();

		const markedPastDue = await this.subscriptionsRepository.update(
			{ status: SubscriptionStatus.ACTIVE, current_period_end: LessThan(now) },
			{ status: SubscriptionStatus.PAST_DUE },
		);
		if (markedPastDue.affected) {
			this.logger.log(`Marked ${markedPastDue.affected} subscription(s) as PAST_DUE`);
		}

		for (const cycle of [BillingCycle.MONTHLY, BillingCycle.ANNUAL] as const) {
			const expireThreshold = new Date(now.getTime() - EXPIRE_AFTER_PAST_DUE_DAYS[cycle] * 24 * 60 * 60 * 1000);
			const markedExpired = await this.subscriptionsRepository.update(
				{ status: SubscriptionStatus.PAST_DUE, billing_cycle: cycle, current_period_end: LessThan(expireThreshold) },
				{ status: SubscriptionStatus.EXPIRED },
			);
			if (markedExpired.affected) {
				this.logger.log(`Marked ${markedExpired.affected} ${cycle} subscription(s) as EXPIRED`);
			}
		}
	}
}
