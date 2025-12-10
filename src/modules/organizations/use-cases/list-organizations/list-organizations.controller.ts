import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginatedResponseDto, PaginationDto } from '@/shared/dto/pagination.dto';
import { ListOrganizationResponseDto } from '../../models/dto/output/list-organization-response.dto';
import { ListOrganizationsDocs } from './docs';
import { ListOrganizationsUseCase } from './list-organizations.use-case';

@ApiTags('Organizations')
@Controller('organizations')
export class ListOrganizationsController {
	constructor(
		@Inject(ListOrganizationsUseCase)
		private readonly listOrganizationsUseCase: ListOrganizationsUseCase,
	) {}

	@Get(':user_id/paginated')
	@ListOrganizationsDocs()
	async execute(@Param('user_id') user_id: string, @Query() paginationDto: PaginationDto): Promise<PaginatedResponseDto<ListOrganizationResponseDto>> {
		return await this.listOrganizationsUseCase.execute(user_id, paginationDto);
	}
}
