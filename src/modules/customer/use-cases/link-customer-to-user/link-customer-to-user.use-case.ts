import { Inject, Injectable } from '@nestjs/common';
import { GetExistingUserUseCase } from '@/modules/users/use-cases/get-existing-user/get-existing-user.use-case';
import { CustomerAlreadyLinkedException } from '../../errors/customer-already-linked.error';
import type { LinkCustomerToUserDto } from '../../models/dto/input/link-customer-to-user.dto';
import type { Customer } from '../../models/entities/customer.entity';
import type { CustomersRepositoryInterface } from '../../models/interfaces/repository.interface';
import { CUSTOMER_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { GetExistingCustomerUseCase } from '../get-existing-customer/get-existing-customer.use-case';

@Injectable()
export class LinkCustomerToUserUseCase {
	constructor(
		@Inject(CUSTOMER_REPOSITORY_INTERFACE_KEY)
		private readonly customersRepository: CustomersRepositoryInterface,
		@Inject(GetExistingCustomerUseCase)
		private readonly getExistingCustomerUseCase: GetExistingCustomerUseCase,
		@Inject(GetExistingUserUseCase)
		private readonly getExistingUserUseCase: GetExistingUserUseCase,
	) {}

	async execute(id: string, linkCustomerToUserDto: LinkCustomerToUserDto): Promise<Customer> {
		const customer = await this.getExistingCustomerUseCase.execute({ where: { id } });

		// Verificar se o cliente já está vinculado a um usuário
		if (customer.user_id) {
			throw new CustomerAlreadyLinkedException();
		}

		// Verificar se o usuário existe
		await this.getExistingUserUseCase.execute({ where: { id: linkCustomerToUserDto.user_id } });

		// Verificar se já existe outro cliente com o mesmo email e user_id na mesma organização
		await this.getExistingCustomerUseCase.execute(
			{
				where: {
					email: customer.email,
					organization_id: customer.organization_id,
					user_id: linkCustomerToUserDto.user_id,
				},
			},
			{ throwIfFound: true },
		);

		await this.customersRepository.update(id, { user_id: linkCustomerToUserDto.user_id });

		return await this.getExistingCustomerUseCase.execute({
			where: { id },
			relations: ['organization', 'user'],
		});
	}
}
