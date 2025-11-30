import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import { ListOrganizationMembersDto } from '../../models/dto/list-organization-members.dto';
import { OrganizationMember } from '../../models/entities/organization-member.entity';
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
	async execute(@Query() listDto: ListOrganizationMembersDto): Promise<PaginatedResponseDto<OrganizationMember>> {
		return await this.listOrganizationMembersUseCase.execute(listDto);
	}
}
