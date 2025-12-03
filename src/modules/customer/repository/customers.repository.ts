import { Injectable } from '@nestjs/common';
import { type DataSource, Repository } from 'typeorm';
import { Customer } from '../models/entities/customer.entity';
import type { CustomersRepositoryInterface } from '../models/interfaces/repository.interface';

@Injectable()
export class CustomersRepository extends Repository<Customer> implements CustomersRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(Customer, dataSource.createEntityManager());
	}
}

