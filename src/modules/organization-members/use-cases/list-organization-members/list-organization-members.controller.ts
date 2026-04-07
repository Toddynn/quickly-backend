import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListOrganizationMembersDto } from '../../models/dto/input/list-organization-members.dto';
import { ListOrganizationMemberResponseDto } from '../../models/dto/output/list-organization-member-response.dto';
import { ListOrganizationMembersDocs } from './docs';
import { ListOrganizationMembersUseCase } from './list-organization-members.use-case';

@ApiTags('Organization Members')
@ApiBearerAuth()
@TenantScoped()
@Controller('organization-members')
export class ListOrganizationMembersController {
	constructor(
		@Inject(ListOrganizationMembersUseCase)
		private readonly listOrganizationMembersUseCase: ListOrganizationMembersUseCase,
	) {}

	@Get()
	@ListOrganizationMembersDocs()
	async execute(
		@ActiveOrganizationId() organizationId: string,
		@Query() listDto: ListOrganizationMembersDto,
	): Promise<PaginatedResponseDto<ListOrganizationMemberResponseDto>> {
		return await this.listOrganizationMembersUseCase.execute({
			...listDto,
			organization_id: organizationId,
		});
	}
}
