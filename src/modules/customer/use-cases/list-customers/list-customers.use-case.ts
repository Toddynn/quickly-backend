import { Inject, Injectable } from '@nestjs/common';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListCustomersDto } from '../../models/dto/input/list-customers.dto';
import type { Customer } from '../../models/entities/customer.entity';
import type { CustomersRepositoryInterface } from '../../models/interfaces/repository.interface';
import { CUSTOMER_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class ListCustomersUseCase {
	constructor(
		@Inject(CUSTOMER_REPOSITORY_INTERFACE_KEY)
		private readonly customersRepository: CustomersRepositoryInterface,
	) {}

	async execute(listDto: ListCustomersDto): Promise<PaginatedResponseDto<Customer>> {
		return await this.customersRepository.findAllPaginated(listDto);
	}
}
