import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListOrganizationMembersDto } from '../../models/dto/input/list-organization-members.dto';
import { ListOrganizationMemberResponseDto } from '../../models/dto/output/list-organization-member-response.dto';
import { ListOrganizationMembersDocs } from './docs';
import { ListOrganizationMembersUseCase } from './list-organization-members.use-case';

@ApiTags('Organization Members')
@Controller('organization-members')
export class ListOrganizationMembersController {
	constructor(
		@Inject(ListOrganizationMembersUseCase)
		private readonly listOrganizationMembersUseCase: ListOrganizationMembersUseCase,
	) {}

	@Get()
	@ListOrganizationMembersDocs()
	async execute(@Query() listDto: ListOrganizationMembersDto): Promise<PaginatedResponseDto<ListOrganizationMemberResponseDto>> {
		return await this.listOrganizationMembersUseCase.execute(listDto);
	}
}
