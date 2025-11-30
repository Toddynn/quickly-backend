import { Inject, Injectable } from '@nestjs/common';
import type { FindOneOptions } from 'typeorm';
import { ThrowsException } from '@/shared/decorators/api-metadata-exceptions.decorator';
import { formatWhereClause } from '@/shared/helpers/format-where-clause.helper';
import { normalizeGetExistingOptions } from '@/shared/helpers/normalize-get-existing-options.helper';
import type { GetExistingOptions } from '@/shared/interfaces/get-existing-options.interface';
import { NotFoundOrganizationInviteException } from '../../errors/not-found-organization-invite.error';
import { OrganizationInviteAlreadyExistsException } from '../../errors/organization-invite-already-exists.error';
import type { OrganizationInvite } from '../../models/entities/organization-invite.entity';
import type { OrganizationInvitesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_INVITE_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class GetExistingOrganizationInviteUseCase {
	constructor(
		@Inject(ORGANIZATION_INVITE_REPOSITORY_INTERFACE_KEY)
		private readonly organizationInvitesRepository: OrganizationInvitesRepositoryInterface,
	) {}

	@ThrowsException(NotFoundOrganizationInviteException)
	@ThrowsException(OrganizationInviteAlreadyExistsException)
	async execute(
		criteria: FindOneOptions<OrganizationInvite>,
		options: GetExistingOptions = {},
	): Promise<OrganizationInvite | null> {
		const { throwIfFound, throwIfNotFound } = normalizeGetExistingOptions(options);
		const fields = formatWhereClause(criteria.where || {});

          const organizationInvite = await this.organizationInvitesRepository.findOne(criteria);

		if (!organizationInvite) {
			if (throwIfNotFound) {
				throw new NotFoundOrganizationInviteException(fields);
			}
			return null;
		}

		if (throwIfFound) {
			throw new OrganizationInviteAlreadyExistsException(fields);
		}

		return organizationInvite;
	}
}
