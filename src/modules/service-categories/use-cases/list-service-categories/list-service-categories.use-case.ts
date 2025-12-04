import { Inject, Injectable } from '@nestjs/common';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListServiceCategoriesDto } from '../../models/dto/output/list-service-categories.dto';
import type { ServiceCategory } from '../../models/entities/service-category.entity';
import type { ServiceCategoriesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { SERVICE_CATEGORY_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class ListServiceCategoriesUseCase {
	constructor(
		@Inject(SERVICE_CATEGORY_REPOSITORY_INTERFACE_KEY)
		private readonly serviceCategoriesRepository: ServiceCategoriesRepositoryInterface,
	) {}

	async execute(listDto: ListServiceCategoriesDto): Promise<PaginatedResponseDto<ServiceCategory>> {
		return this.serviceCategoriesRepository.findAllPaginated(listDto);
	}
}
