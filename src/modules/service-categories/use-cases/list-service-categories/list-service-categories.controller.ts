import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListServiceCategoriesDto } from '../../models/dto/output/list-service-categories.dto';
import { ServiceCategory } from '../../models/entities/service-category.entity';
import { ListServiceCategoriesDocs } from './docs';
import { ListServiceCategoriesUseCase } from './list-service-categories.use-case';

@ApiTags('Service Categories')
@Controller('service-categories')
export class ListServiceCategoriesController {
	constructor(
		@Inject(ListServiceCategoriesUseCase)
		private readonly listServiceCategoriesUseCase: ListServiceCategoriesUseCase,
	) {}

	@Get()
	@ListServiceCategoriesDocs()
	async execute(@Query() listDto: ListServiceCategoriesDto): Promise<PaginatedResponseDto<ServiceCategory>> {
		return await this.listServiceCategoriesUseCase.execute(listDto);
	}
}
