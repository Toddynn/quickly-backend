import { Inject, Injectable } from '@nestjs/common';
import type { ServiceCategory } from '../../models/entities/service-category.entity';
import { GetExistingServiceCategoryUseCase } from '../get-existing-service-category/get-existing-service-category.use-case';

@Injectable()
export class GetServiceCategoryUseCase {
	constructor(
		@Inject(GetExistingServiceCategoryUseCase)
		private readonly getExistingServiceCategoryUseCase: GetExistingServiceCategoryUseCase,
	) {}

	async execute(id: string): Promise<ServiceCategory> {
		return await this.getExistingServiceCategoryUseCase.execute({
			where: { id },
			relations: ['organization'],
		});
	}
}
