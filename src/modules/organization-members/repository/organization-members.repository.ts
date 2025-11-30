import { Injectable } from '@nestjs/common';
import { type DataSource, Repository } from 'typeorm';
import { OrganizationMember } from '../models/entities/organization-member.entity';
import type { OrganizationMembersRepositoryInterface } from '../models/interfaces/repository.interface';

@Injectable()
export class OrganizationMembersRepository extends Repository<OrganizationMember> implements OrganizationMembersRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(OrganizationMember, dataSource.createEntityManager());
	}
}
