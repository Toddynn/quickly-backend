import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import { ListServiceCategoriesDto } from '../../models/dto/output/list-service-categories.dto';
import { ServiceCategory } from '../../models/entities/service-category.entity';
import { ListServiceCategoriesDocs } from './docs';
import { ListServiceCategoriesUseCase } from './list-service-categories.use-case';

@ApiTags('Service Categories')
@ApiCookieAuth()
@TenantScoped()
@Controller('service-categories')
export class ListServiceCategoriesController {
	constructor(
		@Inject(ListServiceCategoriesUseCase)
		private readonly listServiceCategoriesUseCase: ListServiceCategoriesUseCase,
	) {}

	@Get()
	@ListServiceCategoriesDocs()
	async execute(@ActiveOrganizationId() organizationId: string, @Query() listDto: ListServiceCategoriesDto): Promise<PaginatedResponseDto<ServiceCategory>> {
		return await this.listServiceCategoriesUseCase.execute({
			...listDto,
			organization_id: organizationId,
		});
	}
}
