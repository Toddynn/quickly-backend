import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServiceCategory } from '../../models/entities/service-category.entity';
import { GetServiceCategoryDocs } from './docs';
import { GetServiceCategoryUseCase } from './get-service-category.use-case';

@ApiTags('Service Categories')
@Controller('service-categories')
export class GetServiceCategoryController {
	constructor(
		@Inject(GetServiceCategoryUseCase)
		private readonly getServiceCategoryUseCase: GetServiceCategoryUseCase,
	) {}

	@Get(':id')
	@GetServiceCategoryDocs()
	async execute(@Param('id') id: string): Promise<ServiceCategory> {
		return await this.getServiceCategoryUseCase.execute(id);
	}
}
