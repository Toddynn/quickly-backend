import type { Repository } from 'typeorm';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListServiceCategoriesDto } from '../dto/output/list-service-categories.dto';
import type { ServiceCategory } from '../entities/service-category.entity';

export interface ServiceCategoriesRepositoryInterface extends Repository<ServiceCategory> {
	findAllPaginated(listDto: ListServiceCategoriesDto): Promise<PaginatedResponseDto<ServiceCategory>>;
}
