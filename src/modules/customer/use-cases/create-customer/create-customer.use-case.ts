import { Inject, Injectable } from '@nestjs/common';
import { GetExistingOrganizationUseCase } from '@/modules/organizations/use-cases/get-existing-organization/get-existing-organization.use-case';
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
		@Inject(GetExistingOrganizationUseCase)
		private readonly getExistingOrganizationUseCase: GetExistingOrganizationUseCase,
		@Inject(GetExistingUserUseCase)
		private readonly getExistingUserUseCase: GetExistingUserUseCase,
		@Inject(GetExistingCustomerUseCase)
		private readonly getExistingCustomerUseCase: GetExistingCustomerUseCase,
	) {}

	async execute(createCustomerDto: CreateCustomerDto): Promise<Customer> {
		// Verificar se a organização existe
		await this.getExistingOrganizationUseCase.execute({ where: { id: createCustomerDto.organization_id } });

		if (createCustomerDto.user_id) {
			await this.getExistingUserUseCase.execute({ where: { id: createCustomerDto.user_id } });
		}

		// Verificar se já existe um cliente com o mesmo email na mesma organização
		await this.getExistingCustomerUseCase.execute(
			{
				where: {
					email: createCustomerDto.email,
					organization_id: createCustomerDto.organization_id,
				},
			},
			{ throwIfFound: true },
		);

		const customer = this.customersRepository.create(createCustomerDto);

		return await this.customersRepository.save(customer);
	}
}
