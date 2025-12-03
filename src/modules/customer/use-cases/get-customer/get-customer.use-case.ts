import { Inject, Injectable } from '@nestjs/common';
import type { Customer } from '../../models/entities/customer.entity';
import { GetExistingCustomerUseCase } from '../get-existing-customer/get-existing-customer.use-case';

@Injectable()
export class GetCustomerUseCase {
	constructor(
		@Inject(GetExistingCustomerUseCase)
		private readonly getExistingCustomerUseCase: GetExistingCustomerUseCase,
	) {}

	async execute(id: string): Promise<Customer> {
		return await this.getExistingCustomerUseCase.execute({
			where: { id },
			relations: ['organization', 'user'],
		});
	}
}
