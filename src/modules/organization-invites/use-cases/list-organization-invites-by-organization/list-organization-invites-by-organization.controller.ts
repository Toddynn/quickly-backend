import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginatedResponseDto, PaginationDto } from '@/shared/dto/pagination.dto';
import { ListOrganizationInviteWithInviterResponseDto } from '../../models/dto/output/list-organization-invite-with-inviter-response.dto';
import { ListOrganizationInvitesByOrganizationDocs } from './docs';
import { ListOrganizationInvitesByOrganizationUseCase } from './list-organization-invites-by-organization.use-case';

@ApiTags('Organization Invites')
@Controller('organization-invites')
export class ListOrganizationInvitesByOrganizationController {
	constructor(
		@Inject(ListOrganizationInvitesByOrganizationUseCase)
		private readonly listOrganizationInvitesByOrganizationUseCase: ListOrganizationInvitesByOrganizationUseCase,
	) {}

	@Get(':organization_id/paginated')
	@ListOrganizationInvitesByOrganizationDocs()
	async execute(
		@Param('organization_id') organization_id: string,
		@Query() paginationDto: PaginationDto,
	): Promise<PaginatedResponseDto<ListOrganizationInviteWithInviterResponseDto>> {
		return await this.listOrganizationInvitesByOrganizationUseCase.execute(organization_id, paginationDto);
	}
}
