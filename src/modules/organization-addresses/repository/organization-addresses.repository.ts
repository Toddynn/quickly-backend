import { Injectable } from '@nestjs/common';
import { type DataSource, Repository } from 'typeorm';
import { OrganizationAddress } from '../models/entities/organization-address.entity';
import type { OrganizationAddressesRepositoryInterface } from '../models/interfaces/repository.interface';

@Injectable()
export class OrganizationAddressesRepository extends Repository<OrganizationAddress> implements OrganizationAddressesRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(OrganizationAddress, dataSource.createEntityManager());
	}
}
