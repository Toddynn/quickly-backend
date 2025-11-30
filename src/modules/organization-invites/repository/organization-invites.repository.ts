import { Injectable } from '@nestjs/common';
import { type DataSource, Repository } from 'typeorm';
import { OrganizationInvite } from '../models/entities/organization-invite.entity';
import type { OrganizationInvitesRepositoryInterface } from '../models/interfaces/repository.interface';

@Injectable()
export class OrganizationInvitesRepository extends Repository<OrganizationInvite> implements OrganizationInvitesRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(OrganizationInvite, dataSource.createEntityManager());
	}
}
