import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListCustomersDto } from '../../models/dto/input/list-customers.dto';
import type { ListCustomerResponseDto } from '../../models/dto/output/list-customer-response.dto';
import { ListCustomersUseCase } from './list-customers.use-case';
import { ListCustomersDocs } from './docs';

@ApiTags('Customers')
@Controller('customers')
export class ListCustomersController {
	constructor(
		@Inject(ListCustomersUseCase)
		private readonly listCustomersUseCase: ListCustomersUseCase,
	) {}

	@Get()
	@ListCustomersDocs()
	async execute(@Query() listDto: ListCustomersDto): Promise<PaginatedResponseDto<ListCustomerResponseDto>> {
		return await this.listCustomersUseCase.execute(listDto);
	}
}

