import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { UpdateCustomerDto } from '../../models/dto/input/update-customer.dto';
import { Customer } from '../../models/entities/customer.entity';
import { UpdateCustomerUseCase } from './update-customer.use-case';
import { UpdateCustomerDocs } from './docs';

@ApiTags('Customers')
@Controller('customers')
export class UpdateCustomerController {
	constructor(
		@Inject(UpdateCustomerUseCase)
		private readonly updateCustomerUseCase: UpdateCustomerUseCase,
	) {}

	@Patch(':id')
	@UpdateCustomerDocs()
	async execute(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
		return await this.updateCustomerUseCase.execute(id, updateCustomerDto);
	}
}

