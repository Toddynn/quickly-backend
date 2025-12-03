import { Inject, Injectable } from '@nestjs/common';
import { GetExistingUserUseCase } from '@/modules/users/use-cases/get-existing-user/get-existing-user.use-case';
import type { UpdateCustomerDto } from '../../models/dto/input/update-customer.dto';
import type { Customer } from '../../models/entities/customer.entity';
import type { CustomersRepositoryInterface } from '../../models/interfaces/repository.interface';
import { CUSTOMER_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { GetExistingCustomerUseCase } from '../get-existing-customer/get-existing-customer.use-case';

@Injectable()
export class UpdateCustomerUseCase {
	constructor(
		@Inject(CUSTOMER_REPOSITORY_INTERFACE_KEY)
		private readonly customersRepository: CustomersRepositoryInterface,
		@Inject(GetExistingCustomerUseCase)
		private readonly getExistingCustomerUseCase: GetExistingCustomerUseCase,
		@Inject(GetExistingUserUseCase)
		private readonly getExistingUserUseCase: GetExistingUserUseCase,
	) {}

	async execute(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
		const customer = await this.getExistingCustomerUseCase.execute({ where: { id } });

		// Verificar se o usuário existe (se fornecido)
		if (updateCustomerDto.user_id) {
			await this.getExistingUserUseCase.execute({ where: { id: updateCustomerDto.user_id } });
		}

		// Verificar se já existe outro cliente com o mesmo email na mesma organização (se email foi alterado)
		if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
			await this.getExistingCustomerUseCase.execute(
				{
					where: {
						email: updateCustomerDto.email,
						organization_id: customer.organization_id,
					},
				},
				{ throwIfFound: true },
			);
		}

		await this.customersRepository.update(id, updateCustomerDto);

		return await this.getExistingCustomerUseCase.execute({
			where: { id },
			relations: ['organization', 'user'],
		});
	}
}

