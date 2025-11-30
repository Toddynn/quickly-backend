import { Inject, Injectable } from '@nestjs/common';
import type { ServiceCategoriesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { SERVICE_CATEGORY_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { GetExistingServiceCategoryUseCase } from '../get-existing-service-category/get-existing-service-category.use-case';

@Injectable()
export class DeleteServiceCategoryUseCase {
	constructor(
		@Inject(SERVICE_CATEGORY_REPOSITORY_INTERFACE_KEY)
		private readonly serviceCategoriesRepository: ServiceCategoriesRepositoryInterface,
		@Inject(GetExistingServiceCategoryUseCase)
		private readonly getExistingServiceCategoryUseCase: GetExistingServiceCategoryUseCase,
	) {}

	async execute(id: string): Promise<void> {
		const serviceCategory = await this.getExistingServiceCategoryUseCase.execute({ where: { id } });
		await this.serviceCategoriesRepository.remove(serviceCategory);
	}
}
