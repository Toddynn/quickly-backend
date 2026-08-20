import { SetMetadata } from '@nestjs/common';

export const IS_SUBSCRIPTION_GUARD_SKIPPED_KEY = 'isSubscriptionGuardSkipped';
export const SkipSubscriptionGuard = () => SetMetadata(IS_SUBSCRIPTION_GUARD_SKIPPED_KEY, true);
