import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import type { PaginatedResponseDto, PaginationDto } from '@/shared/dto/pagination.dto';
import type { ListOrganizationResponseDto } from '../../models/dto/output/list-organization-response.dto';
import type { OrganizationDto } from '../../models/dto/output/organization.dto';
import type { OrganizationsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

const isListOrganizationResponseDto = (
	organization: Omit<OrganizationDto, 'organization_members' | 'addresses'>,
): organization is ListOrganizationResponseDto => {
	return 'members_count' in organization;
};

@Injectable()
export class ListOrganizationsUseCase {
	constructor(
		@Inject(ORGANIZATION_REPOSITORY_INTERFACE_KEY)
		private readonly organizationsRepository: OrganizationsRepositoryInterface,
	) {}

	async execute(user_id: string, paginationDto: PaginationDto): Promise<PaginatedResponseDto<ListOrganizationResponseDto>> {
		const result = await this.organizationsRepository.findAllPaginated(user_id, paginationDto);

		const mappedData = result.data.map((organization) => {
			if (!isListOrganizationResponseDto(organization)) throw new InternalServerErrorException('Organization is not a ListOrganizationResponseDto');

			return organization;
		});

		return {
			...result,
			data: mappedData,
		};
	}
}
