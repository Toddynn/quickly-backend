import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { PaginatedResponseDto, PaginationDto } from '@/shared/dto/pagination.dto';
import { ListOrganizationInviteWithInviterResponseDto } from '../../models/dto/output/list-organization-invite-with-inviter-response.dto';
import { ListOrganizationInvitesByOrganizationDocs } from './docs';
import { ListOrganizationInvitesByOrganizationUseCase } from './list-organization-invites-by-organization.use-case';

@ApiTags('Organization Invites')
@ApiBearerAuth()
@TenantScoped()
@Controller('organization-invites')
export class ListOrganizationInvitesByOrganizationController {
	constructor(
		@Inject(ListOrganizationInvitesByOrganizationUseCase)
		private readonly listOrganizationInvitesByOrganizationUseCase: ListOrganizationInvitesByOrganizationUseCase,
	) {}

	@Get()
	@ListOrganizationInvitesByOrganizationDocs()
	async execute(
		@ActiveOrganizationId() organizationId: string,
		@Query() paginationDto: PaginationDto,
	): Promise<PaginatedResponseDto<ListOrganizationInviteWithInviterResponseDto>> {
		return await this.listOrganizationInvitesByOrganizationUseCase.execute(organizationId, paginationDto);
	}
}
