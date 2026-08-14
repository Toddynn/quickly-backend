import { Inject, Injectable } from '@nestjs/common';
import { EnforcePlanLimitUseCase } from '@/modules/subscriptions/use-cases/enforce-plan-limit/enforce-plan-limit.use-case';
import { GetExistingUserUseCase } from '@/modules/users/use-cases/get-existing-user/get-existing-user.use-case';
import type { CreateCustomerDto } from '../../models/dto/input/create-customer.dto';
import type { Customer } from '../../models/entities/customer.entity';
import type { CustomersRepositoryInterface } from '../../models/interfaces/repository.interface';
import { CUSTOMER_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { GetExistingCustomerUseCase } from '../get-existing-customer/get-existing-customer.use-case';

@Injectable()
export class CreateCustomerUseCase {
	constructor(
		@Inject(CUSTOMER_REPOSITORY_INTERFACE_KEY)
		private readonly customersRepository: CustomersRepositoryInterface,
		@Inject(GetExistingUserUseCase)
		private readonly getExistingUserUseCase: GetExistingUserUseCase,
		@Inject(GetExistingCustomerUseCase)
		private readonly getExistingCustomerUseCase: GetExistingCustomerUseCase,
		@Inject(EnforcePlanLimitUseCase)
		private readonly enforcePlanLimitUseCase: EnforcePlanLimitUseCase,
	) {}

	async execute(organizationId: string, createCustomerDto: CreateCustomerDto): Promise<Customer> {
		if (createCustomerDto.user_id) {
			await this.getExistingUserUseCase.execute({ where: { id: createCustomerDto.user_id } });
		}

		await this.getExistingCustomerUseCase.execute(
			{
				where: {
					email: createCustomerDto.email,
					organization_id: organizationId,
				},
			},
			{ throwIfFound: true },
		);

		const currentCustomersCount = await this.customersRepository.count({ where: { organization_id: organizationId } });
		await this.enforcePlanLimitUseCase.execute(organizationId, 'customers', currentCustomersCount);

		const customer = this.customersRepository.create({
			...createCustomerDto,
			organization_id: organizationId,
		});

		return await this.customersRepository.save(customer);
	}
}
