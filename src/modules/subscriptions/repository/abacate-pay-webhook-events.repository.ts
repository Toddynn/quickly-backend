import { Injectable } from '@nestjs/common';
import { type DataSource, Repository } from 'typeorm';
import { AbacatePayWebhookEvent } from '../models/entities/abacate-pay-webhook-event.entity';
import type { AbacatePayWebhookEventsRepositoryInterface } from '../models/interfaces/repository.interface';

@Injectable()
export class AbacatePayWebhookEventsRepository extends Repository<AbacatePayWebhookEvent> implements AbacatePayWebhookEventsRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(AbacatePayWebhookEvent, dataSource.createEntityManager());
	}
}
