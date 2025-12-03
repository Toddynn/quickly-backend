import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCustomerDto } from '../../models/dto/input/create-customer.dto';
import { Customer } from '../../models/entities/customer.entity';
import { CreateCustomerUseCase } from './create-customer.use-case';
import { CreateCustomerDocs } from './docs';

@ApiTags('Customers')
@Controller('customers')
export class CreateCustomerController {
	constructor(
		@Inject(CreateCustomerUseCase)
		private readonly createCustomerUseCase: CreateCustomerUseCase,
	) {}

	@Post()
	@CreateCustomerDocs()
	async execute(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
		return await this.createCustomerUseCase.execute(createCustomerDto);
	}
}

