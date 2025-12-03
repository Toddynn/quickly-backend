import { Inject, Injectable } from '@nestjs/common';
import type { FindOneOptions } from 'typeorm';
import { formatWhereClause } from '@/shared/helpers/format-where-clause.helper';
import { normalizeGetExistingOptions } from '@/shared/helpers/normalize-get-existing-options.helper';
import type { GetExistingOptions } from '@/shared/interfaces/get-existing-options';
import { NotFoundOrganizationAddressException } from '../../errors/not-found-organization-address.error';
import { OrganizationAddressAlreadyExistsException } from '../../errors/organization-address-already-exists.error';
import type { OrganizationAddress } from '../../models/entities/organization-address.entity';
import type { OrganizationAddressesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_ADDRESS_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class GetExistingOrganizationAddressUseCase {
	constructor(
		@Inject(ORGANIZATION_ADDRESS_REPOSITORY_INTERFACE_KEY)
		private readonly organizationAddressesRepository: OrganizationAddressesRepositoryInterface,
	) {}

	async execute(criteria: FindOneOptions<OrganizationAddress>, options: GetExistingOptions = {}): Promise<OrganizationAddress | null> {
		const { throwIfFound, throwIfNotFound } = normalizeGetExistingOptions(options);
		const fields = formatWhereClause(criteria.where || {});

		const organizationAddress = await this.organizationAddressesRepository.findOne(criteria);

		if (!organizationAddress) {
			if (throwIfNotFound) {
				throw new NotFoundOrganizationAddressException(fields);
			}
			return null;
		}

		if (throwIfFound) {
			throw new OrganizationAddressAlreadyExistsException(fields);
		}

		return organizationAddress;
	}
}
