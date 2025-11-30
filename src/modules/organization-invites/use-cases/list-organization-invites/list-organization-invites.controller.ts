import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginatedResponseDto, PaginationDto } from '@/shared/dto/pagination.dto';
import { OrganizationInvite } from '../../models/entities/organization-invite.entity';
import { ListOrganizationInvitesDocs } from './docs';
import { ListOrganizationInvitesUseCase } from './list-organization-invites.use-case';

@ApiTags('Organization Invites')
@Controller('organization-invites')
export class ListOrganizationInvitesController {
	constructor(
		@Inject(ListOrganizationInvitesUseCase)
		private readonly listOrganizationInvitesUseCase: ListOrganizationInvitesUseCase,
	) {}

	@Get()
	@ListOrganizationInvitesDocs()
	async execute(@Query() paginationDto: PaginationDto): Promise<PaginatedResponseDto<OrganizationInvite>> {
		return await this.listOrganizationInvitesUseCase.execute(paginationDto);
	}
}
