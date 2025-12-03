import { Inject, Injectable } from '@nestjs/common';
import type { FindOneOptions } from 'typeorm';
import { formatWhereClause } from '@/shared/helpers/format-where-clause.helper';
import { normalizeGetExistingOptions } from '@/shared/helpers/normalize-get-existing-options.helper';
import type { GetExistingOptions } from '@/shared/interfaces/get-existing-options';
import { NotFoundOrganizationException } from '../../errors/not-found-organization.error';
import { OrganizationAlreadyExistsException } from '../../errors/organization-already-exists.error';
import type { Organization } from '../../models/entities/organization.entity';
import type { OrganizationsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class GetExistingOrganizationUseCase {
	constructor(
		@Inject(ORGANIZATION_REPOSITORY_INTERFACE_KEY)
		private readonly organizationsRepository: OrganizationsRepositoryInterface,
	) {}

	async execute(criteria: FindOneOptions<Organization>, options: GetExistingOptions = {}): Promise<Organization | null> {
		const { throwIfFound, throwIfNotFound } = normalizeGetExistingOptions(options);
		const fields = formatWhereClause(criteria.where || {});

		const organization = await this.organizationsRepository.findOne(criteria);

		if (!organization) {
			if (throwIfNotFound) {
				throw new NotFoundOrganizationException(fields);
			}
			return null;
		}

		if (throwIfFound) {
			throw new OrganizationAlreadyExistsException(fields);
		}

		return organization;
	}
}
