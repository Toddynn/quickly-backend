import { Inject, Injectable } from '@nestjs/common';
import type { CreateOrganizationMemberDto } from '../../models/dto/create-organization-member.dto';
import type { OrganizationMember } from '../../models/entities/organization-member.entity';
import type { OrganizationMembersRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_MEMBER_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class CreateOrganizationMemberUseCase {
	constructor(
		@Inject(ORGANIZATION_MEMBER_REPOSITORY_INTERFACE_KEY)
		private readonly organizationMembersRepository: OrganizationMembersRepositoryInterface,
	) {}

	async execute(createOrganizationMemberDto: CreateOrganizationMemberDto): Promise<OrganizationMember> {
		const organizationMember = this.organizationMembersRepository.create(createOrganizationMemberDto);
		return await this.organizationMembersRepository.save(organizationMember);
	}
}
