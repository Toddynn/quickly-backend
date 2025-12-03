import { Inject, Injectable } from '@nestjs/common';
import type { UpdateResult } from 'typeorm';
import type { UpdateServiceCategoryDto } from '../../models/dto/input/update-service-category.dto';
import type { ServiceCategoriesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { SERVICE_CATEGORY_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { GetExistingServiceCategoryUseCase } from '../get-existing-service-category/get-existing-service-category.use-case';

@Injectable()
export class UpdateServiceCategoryUseCase {
	constructor(
		@Inject(SERVICE_CATEGORY_REPOSITORY_INTERFACE_KEY)
		private readonly serviceCategoriesRepository: ServiceCategoriesRepositoryInterface,
		@Inject(GetExistingServiceCategoryUseCase)
		private readonly getExistingServiceCategoryUseCase: GetExistingServiceCategoryUseCase,
	) {}

	async execute(id: string, updateServiceCategoryDto: UpdateServiceCategoryDto): Promise<UpdateResult> {
		const serviceCategory = await this.getExistingServiceCategoryUseCase.execute({ where: { id } });

		return await this.serviceCategoriesRepository.update(serviceCategory.id, updateServiceCategoryDto);
	}
}
