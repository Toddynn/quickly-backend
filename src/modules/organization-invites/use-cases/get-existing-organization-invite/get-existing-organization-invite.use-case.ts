import { Inject, Injectable } from '@nestjs/common';
import type { FindOneOptions } from 'typeorm';
import { ThrowsException } from '@/shared/decorators/api-metadata-exceptions.decorator';
import { formatWhereClause } from '@/shared/helpers/format-where-clause.helper';
import { NotFoundOrganizationInviteException } from '../../errors/not-found-organization-invite.error';
import type { OrganizationInvite } from '../../models/entities/organization-invite.entity';
import type { OrganizationInvitesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_INVITE_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class GetExistingOrganizationInviteUseCase {
	constructor(
		@Inject(ORGANIZATION_INVITE_REPOSITORY_INTERFACE_KEY)
		private readonly organizationInvitesRepository: OrganizationInvitesRepositoryInterface,
	) {}

	@ThrowsException(NotFoundOrganizationInviteException, 404)
	async execute(criteria: FindOneOptions<OrganizationInvite>): Promise<OrganizationInvite> {
		const organizationInvite = await this.organizationInvitesRepository.findOne(criteria);

		if (!organizationInvite) {
			const where = criteria.where || {};
			const fields = formatWhereClause(where);
			throw new NotFoundOrganizationInviteException(fields);
		}

		return organizationInvite;
	}
}
