import { Injectable } from '@nestjs/common';
import { type DataSource, Repository } from 'typeorm';
import { Organization } from '../models/entities/organization.entity';
import type { OrganizationsRepositoryInterface } from '../models/interfaces/repository.interface';

@Injectable()
export class OrganizationsRepository extends Repository<Organization> implements OrganizationsRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(Organization, dataSource.createEntityManager());
	}
}
