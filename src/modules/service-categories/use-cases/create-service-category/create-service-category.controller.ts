import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateServiceCategoryDto } from '../../models/dto/input/create-service-category.dto';
import { ServiceCategory } from '../../models/entities/service-category.entity';
import { CreateServiceCategoryUseCase } from './create-service-category.use-case';
import { CreateServiceCategoryDocs } from './docs';

@ApiTags('Service Categories')
@Controller('service-categories')
export class CreateServiceCategoryController {
	constructor(
		@Inject(CreateServiceCategoryUseCase)
		private readonly createServiceCategoryUseCase: CreateServiceCategoryUseCase,
	) {}

	@Post()
	@CreateServiceCategoryDocs()
	async execute(@Body() createServiceCategoryDto: CreateServiceCategoryDto): Promise<ServiceCategory> {
		return await this.createServiceCategoryUseCase.execute(createServiceCategoryDto);
	}
}
