import { Inject, Injectable } from '@nestjs/common';
import type { PaginatedResponseDto, PaginationDto } from '@/shared/dto/pagination.dto';
import { ListOrganizationResponseDto } from '../../models/dto/list-organization-response.dto';
import type { OrganizationsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class ListOrganizationsUseCase {
	constructor(
		@Inject(ORGANIZATION_REPOSITORY_INTERFACE_KEY)
		private readonly organizationsRepository: OrganizationsRepositoryInterface,
	) {}

	async execute(paginationDto: PaginationDto): Promise<PaginatedResponseDto<ListOrganizationResponseDto>> {
		const { page = 1, limit = 10 } = paginationDto;
		const skip = (page - 1) * limit;

		const queryBuilder = this.organizationsRepository
			.createQueryBuilder('organization')
			.leftJoinAndSelect('organization.owner', 'owner')
			.loadRelationCountAndMap('organization.membersCount', 'organization.organizationMembers')
			.skip(skip)
			.take(limit);

		const [data, total] = await queryBuilder.getManyAndCount();

		const totalPages = Math.ceil(total / limit);

		const mappedData = data.map((organization) => new ListOrganizationResponseDto(organization));

		return {
			data: mappedData,
			page,
			limit,
			total,
			totalPages,
		};
	}
}
