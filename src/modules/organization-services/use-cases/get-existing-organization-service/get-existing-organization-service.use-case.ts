import { Inject, Injectable } from '@nestjs/common';
import type { FindOneOptions } from 'typeorm';
import { ThrowsException } from '@/shared/decorators/api-metadata-exceptions.decorator';
import { formatWhereClause } from '@/shared/helpers/format-where-clause.helper';
import { normalizeGetExistingOptions } from '@/shared/helpers/normalize-get-existing-options.helper';
import type { GetExistingOptions } from '@/shared/interfaces/get-existing-options';
import { NotFoundOrganizationServiceException } from '../../errors/not-found-organization-service.error';
import type { OrganizationService } from '../../models/entities/organization-service.entity';
import type { OrganizationServicesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_SERVICE_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class GetExistingOrganizationServiceUseCase {
	constructor(
		@Inject(ORGANIZATION_SERVICE_REPOSITORY_INTERFACE_KEY)
		private readonly organizationServicesRepository: OrganizationServicesRepositoryInterface,
	) {}

	@ThrowsException(NotFoundOrganizationServiceException)
	async execute(criteria: FindOneOptions<OrganizationService>, options: GetExistingOptions = {}): Promise<OrganizationService | null> {
		const { throwIfFound, throwIfNotFound } = normalizeGetExistingOptions(options);
		const fields = formatWhereClause(criteria.where || {});

		const organizationService = await this.organizationServicesRepository.findOne(criteria);

		if (!organizationService) {
			if (throwIfNotFound) {
				throw new NotFoundOrganizationServiceException(fields);
			}
			return null;
		}

		if (throwIfFound) {
			throw new NotFoundOrganizationServiceException(fields);
		}

		return organizationService;
	}
}
