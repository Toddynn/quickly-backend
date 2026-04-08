import { Injectable } from '@nestjs/common';
import { type DataSource, type FindOptionsWhere, ILike, Repository } from 'typeorm';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListServiceCategoriesDto } from '../models/dto/output/list-service-categories.dto';
import { ServiceCategory } from '../models/entities/service-category.entity';
import type { ServiceCategoriesRepositoryInterface } from '../models/interfaces/repository.interface';

@Injectable()
export class ServiceCategoriesRepository extends Repository<ServiceCategory> implements ServiceCategoriesRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(ServiceCategory, dataSource.createEntityManager());
	}

	async findAllPaginated(listDto: ListServiceCategoriesDto, organization_id: string): Promise<PaginatedResponseDto<ServiceCategory>> {
		const { page = 1, limit = 10, search } = listDto;
		const skip = (page - 1) * limit;

		const where: FindOptionsWhere<ServiceCategory> = {
			organization_id,
		};

		if (search) {
			where.name = ILike(`%${search}%`);
		}

		const [data, total] = await this.findAndCount({
			where,
			skip,
			take: limit,
		});

		const total_pages = Math.ceil(total / limit);

		return {
			data,
			page,
			limit,
			total,
			total_pages,
		};
	}
}
