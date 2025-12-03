import { Inject, Injectable } from '@nestjs/common';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListCustomersDto } from '../../models/dto/input/list-customers.dto';
import type { ListCustomerResponseDto } from '../../models/dto/output/list-customer-response.dto';
import type { CustomersRepositoryInterface } from '../../models/interfaces/repository.interface';
import { CUSTOMER_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class ListCustomersUseCase {
	constructor(
		@Inject(CUSTOMER_REPOSITORY_INTERFACE_KEY)
		private readonly customersRepository: CustomersRepositoryInterface,
	) {}

	async execute(listDto: ListCustomersDto): Promise<PaginatedResponseDto<ListCustomerResponseDto>> {
		const { page = 1, limit = 10, organization_id, user_id, search } = listDto;
		const skip = (page - 1) * limit;

		const queryBuilder = this.customersRepository.createQueryBuilder('customer');

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
