import { Inject, Injectable } from '@nestjs/common';
import type { FindOneOptions } from 'typeorm';
import { ThrowsException } from '@/shared/decorators/api-metadata-exceptions.decorator';
import { formatWhereClause } from '@/shared/helpers/format-where-clause.helper';
import { NotFoundOrganizationException } from '../../errors/not-found-organization.error';
import type { Organization } from '../../models/entities/organization.entity';
import type { OrganizationsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class GetExistingOrganizationUseCase {
	constructor(
		@Inject(ORGANIZATION_REPOSITORY_INTERFACE_KEY)
		private readonly organizationsRepository: OrganizationsRepositoryInterface,
	) {}

	@ThrowsException(NotFoundOrganizationException, 404)
	async execute(criteria: FindOneOptions<Organization>): Promise<Organization> {
		const organization = await this.organizationsRepository.findOne(criteria);

		if (!organization) {
			const where = criteria.where || {};
			const fields = formatWhereClause(where);
			throw new NotFoundOrganizationException(fields);
		}

		return organization;
	}
}
