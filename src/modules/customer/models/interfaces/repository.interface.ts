import type { Repository } from 'typeorm';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListCustomersDto } from '../dto/input/list-customers.dto';
import type { Customer } from '../entities/customer.entity';

export interface CustomersRepositoryInterface extends Repository<Customer> {
	findAllPaginated(listDto: ListCustomersDto): Promise<PaginatedResponseDto<Customer>>;
}
