import { Inject, Injectable } from '@nestjs/common';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListOrganizationMembersDto } from '../../models/dto/input/list-organization-members.dto';
import { ListOrganizationMemberResponseDto } from '../../models/dto/output/list-organization-member-response.dto';
import type { OrganizationMembersRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_MEMBER_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class ListOrganizationMembersUseCase {
	constructor(
		@Inject(ORGANIZATION_MEMBER_REPOSITORY_INTERFACE_KEY)
		private readonly organizationMembersRepository: OrganizationMembersRepositoryInterface,
	) {}

	async execute(listDto: ListOrganizationMembersDto): Promise<PaginatedResponseDto<ListOrganizationMemberResponseDto>> {
		const { page = 1, limit = 10, is_active } = listDto;
		const skip = (page - 1) * limit;

		const where: { active?: boolean } = {};
		if (is_active !== undefined) {
			where.active = is_active;
		}

		const [data, total] = await this.organizationMembersRepository.findAndCount({
			where,
			relations: ['organization', 'user'],
			skip,
			take: limit,
		});

		const totalPages = Math.ceil(total / limit);

		const mappedData = data.map((member) => new ListOrganizationMemberResponseDto(member));

		return {
			data: mappedData,
			page,
			limit,
			total,
			totalPages,
		};
	}
}
