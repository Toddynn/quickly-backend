import { Inject, Injectable } from '@nestjs/common';
import type { FindOneOptions } from 'typeorm';
import { formatWhereClause } from '@/shared/helpers/format-where-clause.helper';
import { normalizeGetExistingOptions } from '@/shared/helpers/normalize-get-existing-options.helper';
import type { GetExistingOptions } from '@/shared/interfaces/get-existing-options';
import { NotFoundSubscriptionException } from '../../errors/not-found-subscription.error';
import { SubscriptionAlreadyExistsException } from '../../errors/subscription-already-exists.error';
import type { Subscription } from '../../models/entities/subscription.entity';
import type { SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { SUBSCRIPTION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class GetExistingSubscriptionUseCase {
	constructor(
		@Inject(SUBSCRIPTION_REPOSITORY_INTERFACE_KEY)
		private readonly subscriptionsRepository: SubscriptionsRepositoryInterface,
	) {}

	async execute(criteria: FindOneOptions<Subscription>, options: GetExistingOptions = {}): Promise<Subscription | null> {
		const { throwIfFound, throwIfNotFound } = normalizeGetExistingOptions(options);
		const fields = formatWhereClause(criteria.where || {});

		const subscription = await this.subscriptionsRepository.findOne(criteria);

		if (!subscription) {
			if (throwIfNotFound) throw new NotFoundSubscriptionException(fields);
			return null;
		}

		if (throwIfFound) throw new SubscriptionAlreadyExistsException(fields);

		return subscription;
	}
}
