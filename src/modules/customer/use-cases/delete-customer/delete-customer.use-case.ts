import { Inject, Injectable } from '@nestjs/common';
import type { CustomersRepositoryInterface } from '../../models/interfaces/repository.interface';
import { CUSTOMER_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { GetExistingCustomerUseCase } from '../get-existing-customer/get-existing-customer.use-case';

@Injectable()
export class DeleteCustomerUseCase {
	constructor(
		@Inject(CUSTOMER_REPOSITORY_INTERFACE_KEY)
		private readonly customersRepository: CustomersRepositoryInterface,
		@Inject(GetExistingCustomerUseCase)
		private readonly getExistingCustomerUseCase: GetExistingCustomerUseCase,
	) {}

	async execute(id: string): Promise<void> {
		const customer = await this.getExistingCustomerUseCase.execute({ where: { id } });
		await this.customersRepository.delete({ id: customer.id });
	}
}
