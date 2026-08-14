import { Injectable } from '@nestjs/common';
import { type DataSource, Repository } from 'typeorm';
import { OrganizationWorkingHours } from '../models/entities/organization-working-hours.entity';
import type { OrganizationWorkingHoursRepositoryInterface } from '../models/interfaces/repository.interface';

@Injectable()
export class OrganizationWorkingHoursRepository extends Repository<OrganizationWorkingHours> implements OrganizationWorkingHoursRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(OrganizationWorkingHours, dataSource.createEntityManager());
	}
}
