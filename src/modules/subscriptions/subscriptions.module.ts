import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AbacatePayModule } from '@/modules/abacate-pay/abacate-pay.module';
import { PlansModule } from '@/modules/plans/plans.module';
import { AbacatePayWebhookEvent } from './models/entities/abacate-pay-webhook-event.entity';
import { Subscription } from './models/entities/subscription.entity';
import { AbacatePayWebhookEventsRepository } from './repository/abacate-pay-webhook-events.repository';
import { SubscriptionsRepository } from './repository/subscriptions.repository';
import {
	ABACATE_PAY_WEBHOOK_EVENT_REPOSITORY_INTERFACE_KEY,
	SUBSCRIPTION_REPOSITORY_INTERFACE_KEY,
} from './shared/constants/repository-interface-key';
import { CancelSubscriptionController } from './use-cases/cancel-subscription/cancel-subscription.controller';
import { CancelSubscriptionUseCase } from './use-cases/cancel-subscription/cancel-subscription.use-case';
import { ChangeSubscriptionPlanController } from './use-cases/change-subscription-plan/change-subscription-plan.controller';
import { ChangeSubscriptionPlanUseCase } from './use-cases/change-subscription-plan/change-subscription-plan.use-case';
import { CreateAnnualCheckoutController } from './use-cases/create-annual-checkout/create-annual-checkout.controller';
import { CreateAnnualCheckoutUseCase } from './use-cases/create-annual-checkout/create-annual-checkout.use-case';
import { CreateSubscriptionUseCase } from './use-cases/create-subscription/create-subscription.use-case';
import { EnforcePlanLimitUseCase } from './use-cases/enforce-plan-limit/enforce-plan-limit.use-case';
import { ExpireStaleSubscriptionsUseCase } from './use-cases/expire-stale-subscriptions/expire-stale-subscriptions.use-case';
import { GetExistingSubscriptionUseCase } from './use-cases/get-existing-subscription/get-existing-subscription.use-case';
import { GetOrganizationSubscriptionController } from './use-cases/get-organization-subscription/get-organization-subscription.controller';
import { GetOrganizationSubscriptionUseCase } from './use-cases/get-organization-subscription/get-organization-subscription.use-case';
import { AbacatePayWebhookController } from './use-cases/handle-abacate-pay-webhook/abacate-pay-webhook.controller';
import { HandleAbacatePayWebhookUseCase } from './use-cases/handle-abacate-pay-webhook/handle-abacate-pay-webhook.use-case';

@Module({
	imports: [TypeOrmModule.forFeature([Subscription, AbacatePayWebhookEvent]), PlansModule, AbacatePayModule],
	controllers: [
		GetOrganizationSubscriptionController,
		ChangeSubscriptionPlanController,
		CancelSubscriptionController,
		CreateAnnualCheckoutController,
		AbacatePayWebhookController,
	],
	providers: [
		{
			provide: SUBSCRIPTION_REPOSITORY_INTERFACE_KEY,
			useFactory: (dataSource: DataSource) => new SubscriptionsRepository(dataSource),
			inject: [DataSource],
		},
		{
			provide: ABACATE_PAY_WEBHOOK_EVENT_REPOSITORY_INTERFACE_KEY,
			useFactory: (dataSource: DataSource) => new AbacatePayWebhookEventsRepository(dataSource),
			inject: [DataSource],
		},
		GetExistingSubscriptionUseCase,
		EnforcePlanLimitUseCase,
		CreateSubscriptionUseCase,
		GetOrganizationSubscriptionUseCase,
		ChangeSubscriptionPlanUseCase,
		CancelSubscriptionUseCase,
		CreateAnnualCheckoutUseCase,
		HandleAbacatePayWebhookUseCase,
		ExpireStaleSubscriptionsUseCase,
	],
	exports: [SUBSCRIPTION_REPOSITORY_INTERFACE_KEY, GetExistingSubscriptionUseCase, EnforcePlanLimitUseCase, CreateSubscriptionUseCase],
})
export class SubscriptionsModule {}
