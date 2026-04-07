import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { Customer } from '../../models/entities/customer.entity';
import { GetCustomerDocs } from './docs';
import { GetCustomerUseCase } from './get-customer.use-case';

@ApiTags('Customers')
@ApiCookieAuth()
@TenantScoped()
@Controller('customers')
export class GetCustomerController {
	constructor(
		@Inject(GetCustomerUseCase)
		private readonly getCustomerUseCase: GetCustomerUseCase,
	) {}

	@Get(':id')
	@GetCustomerDocs()
	async execute(@ActiveOrganizationId() organizationId: string, @Param('id') id: string): Promise<Customer> {
		return await this.getCustomerUseCase.execute(id, organizationId);
	}
}
