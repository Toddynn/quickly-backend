import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import type { PaginatedResponseDto, PaginationDto } from '@/shared/dto/pagination.dto';
import type { ListOrganizationInviteWithInviterResponseDto } from '../../models/dto/output/list-organization-invite-with-inviter-response.dto';
import type { OrganizationInviteDto } from '../../models/dto/output/organization-invite.dto';
import type { OrganizationInvitesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_INVITE_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

const isListOrganizationInviteWithInviterResponseDto = (
	organizationInvite: Omit<OrganizationInviteDto, 'organization' | 'inviter'>,
): organizationInvite is ListOrganizationInviteWithInviterResponseDto => {
	return 'inviter' in organizationInvite;
};

@Injectable()
export class ListOrganizationInvitesByOrganizationUseCase {
	constructor(
		@Inject(ORGANIZATION_INVITE_REPOSITORY_INTERFACE_KEY)
		private readonly organizationInvitesRepository: OrganizationInvitesRepositoryInterface,
	) {}

	async execute(organization_id: string, paginationDto: PaginationDto): Promise<PaginatedResponseDto<ListOrganizationInviteWithInviterResponseDto>> {
		const result = await this.organizationInvitesRepository.findAllPaginatedByOrganizationId(organization_id, paginationDto);

		const mappedData = result.data.map((organization) => {
			if (!isListOrganizationInviteWithInviterResponseDto(organization))
				throw new InternalServerErrorException('Organization invite is not a ListOrganizationInviteWithInviterResponseDto');

			return organization;
		});

		return {
			...result,
			data: mappedData,
		};
	}
}
