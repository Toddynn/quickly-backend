import { Injectable } from '@nestjs/common';
import { type DataSource, Repository } from 'typeorm';
import { ServiceCategory } from '../models/entities/service-category.entity';
import type { ServiceCategoriesRepositoryInterface } from '../models/interfaces/repository.interface';

@Injectable()
export class ServiceCategoriesRepository extends Repository<ServiceCategory> implements ServiceCategoriesRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(ServiceCategory, dataSource.createEntityManager());
	}
}
