import type { Repository } from 'typeorm';
import type { AbacatePayWebhookEvent } from '../entities/abacate-pay-webhook-event.entity';
import type { Subscription } from '../entities/subscription.entity';

export type SubscriptionsRepositoryInterface = Repository<Subscription>;
export type AbacatePayWebhookEventsRepositoryInterface = Repository<AbacatePayWebhookEvent>;
