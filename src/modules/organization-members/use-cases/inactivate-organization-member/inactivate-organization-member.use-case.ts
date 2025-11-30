import { Inject, Injectable } from '@nestjs/common';
import type { OrganizationMembersRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_MEMBER_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { GetExistingOrganizationMemberUseCase } from '../get-existing-organization-member/get-existing-organization-member.use-case';

@Injectable()
export class InactivateOrganizationMemberUseCase {
	constructor(
		@Inject(ORGANIZATION_MEMBER_REPOSITORY_INTERFACE_KEY)
		private readonly organizationMembersRepository: OrganizationMembersRepositoryInterface,
		@Inject(GetExistingOrganizationMemberUseCase)
		private readonly getExistingOrganizationMemberUseCase: GetExistingOrganizationMemberUseCase,
	) {}

	async execute(id: string): Promise<void> {
		await this.getExistingOrganizationMemberUseCase.execute({ where: { id } });
		await this.organizationMembersRepository.update(id, { active: false });
	}
}
