import { Inject, Injectable } from '@nestjs/common';
import type { FindOneOptions } from 'typeorm';
import { formatWhereClause } from '@/shared/helpers/format-where-clause.helper';
import { normalizeGetExistingOptions } from '@/shared/helpers/normalize-get-existing-options.helper';
import type { GetExistingOptions } from '@/shared/interfaces/get-existing-options';
import { CustomerAlreadyExistsException } from '../../errors/customer-already-exists.error';
import { NotFoundCustomerException } from '../../errors/not-found-customer.error';
import type { Customer } from '../../models/entities/customer.entity';
import type { CustomersRepositoryInterface } from '../../models/interfaces/repository.interface';
import { CUSTOMER_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class GetExistingCustomerUseCase {
	constructor(
		@Inject(CUSTOMER_REPOSITORY_INTERFACE_KEY)
		private readonly customersRepository: CustomersRepositoryInterface,
	) {}

	async execute(criteria: FindOneOptions<Customer>, options: GetExistingOptions = {}): Promise<Customer | null> {
		const { throwIfFound, throwIfNotFound } = normalizeGetExistingOptions(options);
		const fields = formatWhereClause(criteria.where || {});

		const customer = await this.customersRepository.findOne(criteria);

		if (!customer) {
			if (throwIfNotFound) {
				throw new NotFoundCustomerException(fields);
			}
			return null;
		}

		if (throwIfFound) {
			throw new CustomerAlreadyExistsException(fields);
		}

		return customer;
	}
}
