import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import type { PaginatedResponseDto, PaginationDto } from '@/shared/dto/pagination.dto';
import type { ListOrganizationResponseDto } from '../../models/dto/output/list-organization-response.dto';
import type { OrganizationDto } from '../../models/dto/output/organization.dto';
import type { OrganizationsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

const isListOrganizationResponseDto = (
	organization: Omit<OrganizationDto, 'organization_members' | 'addresses'>,
): organization is ListOrganizationResponseDto => {
	return 'membersCount' in organization;
};
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
			.loadRelationCountAndMap('organization.membersCount', 'organization.organization_members')
			.skip(skip)
			.take(limit);

		const [data, total] = await queryBuilder.getManyAndCount();

		const totalPages = Math.ceil(total / limit);

		const mappedData = data.map((organization) => {
			if (!isListOrganizationResponseDto(organization)) throw new InternalServerErrorException('Organization is not a ListOrganizationResponseDto');

			return organization;
		});

		return {
			data: mappedData,
			page,
			limit,
			total,
			totalPages,
		};
	}
}
