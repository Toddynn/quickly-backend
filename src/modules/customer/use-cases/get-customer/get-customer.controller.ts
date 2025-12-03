import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Customer } from '../../models/entities/customer.entity';
import { GetCustomerDocs } from './docs';
import { GetCustomerUseCase } from './get-customer.use-case';

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
