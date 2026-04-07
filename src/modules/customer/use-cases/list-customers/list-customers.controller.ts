import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import { ListCustomersDto } from '../../models/dto/input/list-customers.dto';
import { Customer } from '../../models/entities/customer.entity';
import { ListCustomersDocs } from './docs';
import { ListCustomersUseCase } from './list-customers.use-case';

@ApiTags('Customers')
@TenantScoped()
@Controller('customers')
export class ListCustomersController {
	constructor(
		@Inject(ListCustomersUseCase)
		private readonly listCustomersUseCase: ListCustomersUseCase,
	) {}

	@Get()
	@ListCustomersDocs()
	async execute(@ActiveOrganizationId() organizationId: string, @Query() listDto: ListCustomersDto): Promise<PaginatedResponseDto<Customer>> {
		return await this.listCustomersUseCase.execute({
			...listDto,
			organization_id: organizationId,
		});
	}
}
