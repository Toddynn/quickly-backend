import { Injectable } from '@nestjs/common';
import { type DataSource, Repository } from 'typeorm';
import { Plan } from '../models/entities/plan.entity';
import type { PlansRepositoryInterface } from '../models/interfaces/repository.interface';

@Injectable()
export class PlansRepository extends Repository<Plan> implements PlansRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(Plan, dataSource.createEntityManager());
	}
}
