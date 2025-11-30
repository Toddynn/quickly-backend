import { Injectable } from '@nestjs/common';
import { type DataSource, Repository } from 'typeorm';
import { OrganizationService } from '../models/entities/organization-service.entity';
import type { OrganizationServicesRepositoryInterface } from '../models/interfaces/repository.interface';

@Injectable()
export class OrganizationServicesRepository extends Repository<OrganizationService> implements OrganizationServicesRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(OrganizationService, dataSource.createEntityManager());
	}
}
