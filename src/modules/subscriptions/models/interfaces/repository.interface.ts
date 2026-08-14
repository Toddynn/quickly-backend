import type { Repository } from 'typeorm';
import type { Subscription } from '../entities/subscription.entity';

export type SubscriptionsRepositoryInterface = Repository<Subscription>;
