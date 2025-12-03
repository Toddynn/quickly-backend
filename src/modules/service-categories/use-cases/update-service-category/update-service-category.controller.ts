import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { UpdateResult } from 'typeorm';
import { UpdateServiceCategoryDto } from '../../models/dto/input/update-service-category.dto';
import { UpdateServiceCategoryDocs } from './docs';
import { UpdateServiceCategoryUseCase } from './update-service-category.use-case';

@ApiTags('Service Categories')
@Controller('service-categories')
export class UpdateServiceCategoryController {
	constructor(
		@Inject(UpdateServiceCategoryUseCase)
		private readonly updateServiceCategoryUseCase: UpdateServiceCategoryUseCase,
	) {}

	@Patch(':id')
	@UpdateServiceCategoryDocs()
	async execute(@Param('id') id: string, @Body() updateServiceCategoryDto: UpdateServiceCategoryDto): Promise<UpdateResult> {
		return await this.updateServiceCategoryUseCase.execute(id, updateServiceCategoryDto);
	}
}
