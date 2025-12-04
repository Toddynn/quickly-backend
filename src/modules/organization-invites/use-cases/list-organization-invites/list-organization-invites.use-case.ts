import { Inject, Injectable } from '@nestjs/common';
import type { PaginatedResponseDto, PaginationDto } from '@/shared/dto/pagination.dto';
import type { ListOrganizationInviteResponseDto } from '../../models/dto/output/list-organization-invite-response.dto';
import type { OrganizationInvitesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_INVITE_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class ListOrganizationInvitesUseCase {
	constructor(
		@Inject(ORGANIZATION_INVITE_REPOSITORY_INTERFACE_KEY)
		private readonly organizationInvitesRepository: OrganizationInvitesRepositoryInterface,
	) {}

	async execute(paginationDto: PaginationDto): Promise<PaginatedResponseDto<ListOrganizationInviteResponseDto>> {
		return this.organizationInvitesRepository.findAllPaginated(paginationDto);
	}
}
