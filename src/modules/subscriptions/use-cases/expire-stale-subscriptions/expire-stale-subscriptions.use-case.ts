import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LessThan } from 'typeorm';
import type { SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { SUBSCRIPTION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { SubscriptionStatus } from '../../shared/enums/subscription-status.enum';

// AbacatePay não avisa cobrança falha por webhook — só `subscription.renewed` (sucesso) ou
// `subscription.cancelled` (terminal). PAST_DUE/EXPIRED só existem via essa varredura.
// Janela de EXPIRED bate com o retryPolicy configurado em create-subscription.use-case
// (maxRetry: 3, retryEvery: 3 dias) — depois disso a AbacatePay já desistiu de tentar cobrar.
const EXPIRE_AFTER_PAST_DUE_DAYS = 9;

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

		const expireThreshold = new Date(now.getTime() - EXPIRE_AFTER_PAST_DUE_DAYS * 24 * 60 * 60 * 1000);
		const markedExpired = await this.subscriptionsRepository.update(
			{ status: SubscriptionStatus.PAST_DUE, current_period_end: LessThan(expireThreshold) },
			{ status: SubscriptionStatus.EXPIRED },
		);
		if (markedExpired.affected) {
			this.logger.log(`Marked ${markedExpired.affected} subscription(s) as EXPIRED`);
		}
	}
}
