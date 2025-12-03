import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Customer } from '../../models/entities/customer.entity';
import { GetCustomerUseCase } from './get-customer.use-case';
import { GetCustomerDocs } from './docs';

@ApiTags('Customers')
@Controller('customers')
export class GetCustomerController {
	constructor(
		@Inject(GetCustomerUseCase)
		private readonly getCustomerUseCase: GetCustomerUseCase,
	) {}

	@Get(':id')
	@GetCustomerDocs()
	async execute(@Param('id') id: string): Promise<Customer> {
		return await this.getCustomerUseCase.execute(id);
	}
}

