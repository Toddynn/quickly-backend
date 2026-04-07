import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import type { UpdateCustomerDto } from '../../models/dto/input/update-customer.dto';
import { Customer } from '../../models/entities/customer.entity';
import { UpdateCustomerDocs } from './docs';
import { UpdateCustomerUseCase } from './update-customer.use-case';

@ApiTags('Customers')
@ApiBearerAuth()
@TenantScoped()
@Controller('customers')
export class UpdateCustomerController {
	constructor(
		@Inject(UpdateCustomerUseCase)
		private readonly updateCustomerUseCase: UpdateCustomerUseCase,
	) {}

	@Patch(':id')
	@UpdateCustomerDocs()
	async execute(@ActiveOrganizationId() organizationId: string, @Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
		return await this.updateCustomerUseCase.execute(id, organizationId, updateCustomerDto);
	}
}
