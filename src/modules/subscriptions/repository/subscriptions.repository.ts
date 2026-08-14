import { Injectable } from '@nestjs/common';
import { type DataSource, Repository } from 'typeorm';
import { Subscription } from '../models/entities/subscription.entity';
import type { SubscriptionsRepositoryInterface } from '../models/interfaces/repository.interface';

@Injectable()
export class SubscriptionsRepository extends Repository<Subscription> implements SubscriptionsRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(Subscription, dataSource.createEntityManager());
	}
}
