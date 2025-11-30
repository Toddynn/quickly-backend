import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginatedResponseDto, PaginationDto } from '@/shared/dto/pagination.dto';
import { Organization } from '../../models/entities/organization.entity';
import { ListOrganizationsDocs } from './docs';
import { ListOrganizationsUseCase } from './list-organizations.use-case';

@ApiTags('Organizations')
@Controller('organizations')
export class ListOrganizationsController {
	constructor(
		@Inject(ListOrganizationsUseCase)
		private readonly listOrganizationsUseCase: ListOrganizationsUseCase,
	) {}

	@Get()
	@ListOrganizationsDocs()
	async execute(@Query() paginationDto: PaginationDto): Promise<PaginatedResponseDto<Organization>> {
		return await this.listOrganizationsUseCase.execute(paginationDto);
	}
}
