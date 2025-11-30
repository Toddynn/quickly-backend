import { Inject, Injectable } from '@nestjs/common';
import type { FindOneOptions } from 'typeorm';
import { ThrowsException } from '@/shared/decorators/api-metadata-exceptions.decorator';
import { formatWhereClause } from '@/shared/helpers/format-where-clause.helper';
import { NotFoundOrganizationMemberException } from '../../errors/not-found-organization-member.error';
import type { OrganizationMember } from '../../models/entities/organization-member.entity';
import type { OrganizationMembersRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_MEMBER_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class GetExistingOrganizationMemberUseCase {
	constructor(
		@Inject(ORGANIZATION_MEMBER_REPOSITORY_INTERFACE_KEY)
		private readonly organizationMembersRepository: OrganizationMembersRepositoryInterface,
	) {}

	@ThrowsException(NotFoundOrganizationMemberException, 404)
	async execute(criteria: FindOneOptions<OrganizationMember>): Promise<OrganizationMember> {
		const organizationMember = await this.organizationMembersRepository.findOne(criteria);

		if (!organizationMember) {
			const where = criteria.where || {};
			const fields = formatWhereClause(where);
			throw new NotFoundOrganizationMemberException(fields);
		}

		return organizationMember;
	}
}
