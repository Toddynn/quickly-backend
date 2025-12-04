import { Injectable } from '@nestjs/common';
import { type DataSource, type FindOptionsWhere, Repository } from 'typeorm';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListServiceCategoriesDto } from '../models/dto/output/list-service-categories.dto';
import { ServiceCategory } from '../models/entities/service-category.entity';
import type { ServiceCategoriesRepositoryInterface } from '../models/interfaces/repository.interface';

@Injectable()
export class ServiceCategoriesRepository extends Repository<ServiceCategory> implements ServiceCategoriesRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(ServiceCategory, dataSource.createEntityManager());
	}

	async findAllPaginated(listDto: ListServiceCategoriesDto): Promise<PaginatedResponseDto<ServiceCategory>> {
		const { page = 1, limit = 10, organization_id } = listDto;
		const skip = (page - 1) * limit;

		const where: FindOptionsWhere<ServiceCategory> = {};

		if (organization_id) {
			where.organization_id = organization_id;
		}

		const [data, total] = await this.findAndCount({
			where,
			relations: ['organization'],
			skip,
			take: limit,
		});

		const totalPages = Math.ceil(total / limit);

		return {
			data,
			page,
			limit,
			total,
			totalPages,
		};
	}
}
