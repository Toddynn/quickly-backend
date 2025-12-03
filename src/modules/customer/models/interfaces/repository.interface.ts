import type { Repository } from 'typeorm';
import type { Customer } from '../entities/customer.entity';

export interface CustomersRepositoryInterface extends Repository<Customer> {}

