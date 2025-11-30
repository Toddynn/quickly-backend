import { Controller, Delete, Inject, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteServiceCategoryUseCase } from './delete-service-category.use-case';
import { DeleteServiceCategoryDocs } from './docs';

@ApiTags('Service Categories')
@Controller('service-categories')
export class DeleteServiceCategoryController {
	constructor(
		@Inject(DeleteServiceCategoryUseCase)
		private readonly deleteServiceCategoryUseCase: DeleteServiceCategoryUseCase,
	) {}

	@Delete(':id')
	@DeleteServiceCategoryDocs()
	async execute(@Param('id') id: string): Promise<void> {
		return await this.deleteServiceCategoryUseCase.execute(id);
	}
}
