import { Injectable } from '@nestjs/common';
import { type DataSource, Repository } from 'typeorm';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListCustomersDto } from '../models/dto/input/list-customers.dto';
import { Customer } from '../models/entities/customer.entity';
import type { CustomersRepositoryInterface } from '../models/interfaces/repository.interface';

@Injectable()
export class CustomersRepository extends Repository<Customer> implements CustomersRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(Customer, dataSource.createEntityManager());
	}

	async findAllPaginated(listDto: ListCustomersDto): Promise<PaginatedResponseDto<Customer>> {
		const { page = 1, limit = 10, organization_id, user_id, search } = listDto;
		const skip = (page - 1) * limit;

		const queryBuilder = this.createQueryBuilder('customer');

		if (organization_id) {
			queryBuilder.andWhere('customer.organization_id = :organization_id', { organization_id });
		}

		if (user_id !== undefined) {
			queryBuilder.andWhere('customer.user_id = :user_id', { user_id });
		}

		if (search) {
			queryBuilder.andWhere('(customer.name ILIKE :search OR customer.email ILIKE :search OR customer.phone ILIKE :search)', {
				search: `%${search}%`,
			});
		}

		queryBuilder.leftJoinAndSelect('customer.organization', 'organization');
		queryBuilder.leftJoinAndSelect('customer.user', 'user');
		queryBuilder.skip(skip);
		queryBuilder.take(limit);
		queryBuilder.orderBy('customer.created_at', 'DESC');

		const [data, total] = await queryBuilder.getManyAndCount();

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
