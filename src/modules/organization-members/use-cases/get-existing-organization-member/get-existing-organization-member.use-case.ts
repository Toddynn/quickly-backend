import { Inject, Injectable } from '@nestjs/common';
import type { FindOneOptions } from 'typeorm';
import { ThrowsException } from '@/shared/decorators/api-metadata-exceptions.decorator';
import { formatWhereClause } from '@/shared/helpers/format-where-clause.helper';
import { normalizeGetExistingOptions } from '@/shared/helpers/normalize-get-existing-options.helper';
import type { GetExistingOptions } from '@/shared/interfaces/get-existing-options';
import { NotFoundOrganizationMemberException } from '../../errors/not-found-organization-member.error';
import { OrganizationMemberAlreadyExistsException } from '../../errors/organization-member-already-exists.error';
import type { OrganizationMember } from '../../models/entities/organization-member.entity';
import type { OrganizationMembersRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_MEMBER_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class GetExistingOrganizationMemberUseCase {
	constructor(
		@Inject(ORGANIZATION_MEMBER_REPOSITORY_INTERFACE_KEY)
		private readonly organizationMembersRepository: OrganizationMembersRepositoryInterface,
	) {}

	@ThrowsException(NotFoundOrganizationMemberException)
	@ThrowsException(OrganizationMemberAlreadyExistsException)
	async execute(criteria: FindOneOptions<OrganizationMember>, options: GetExistingOptions = {}): Promise<OrganizationMember | null> {
		const { throwIfFound, throwIfNotFound } = normalizeGetExistingOptions(options);
		const fields = formatWhereClause(criteria.where || {});

		const organizationMember = await this.organizationMembersRepository.findOne(criteria);

		if (!organizationMember) {
			if (throwIfNotFound) {
				throw new NotFoundOrganizationMemberException(fields);
			}
			return null;
		}

		if (throwIfFound) {
			throw new OrganizationMemberAlreadyExistsException(fields);
		}

		return organizationMember;
	}
}
