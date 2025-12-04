import { Inject, Injectable } from '@nestjs/common';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListOrganizationMembersDto } from '../../models/dto/input/list-organization-members.dto';
import type { ListOrganizationMemberResponseDto } from '../../models/dto/output/list-organization-member-response.dto';
import type { OrganizationMembersRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_MEMBER_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class ListOrganizationMembersUseCase {
	constructor(
		@Inject(ORGANIZATION_MEMBER_REPOSITORY_INTERFACE_KEY)
		private readonly organizationMembersRepository: OrganizationMembersRepositoryInterface,
	) {}

	async execute(listDto: ListOrganizationMembersDto): Promise<PaginatedResponseDto<ListOrganizationMemberResponseDto>> {
		return this.organizationMembersRepository.findAllPaginated(listDto);
	}
}
