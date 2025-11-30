import type { Repository } from 'typeorm';
import type { ServiceCategory } from '../entities/service-category.entity';

export interface ServiceCategoriesRepositoryInterface extends Repository<ServiceCategory> {}
