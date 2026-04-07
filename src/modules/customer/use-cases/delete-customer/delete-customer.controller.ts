import { Controller, Delete, Inject, Param } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { Roles } from '@/modules/auth/shared/decorators/roles.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { OrganizationRole } from '@/shared/constants/organization-roles';
import { DeleteCustomerUseCase } from './delete-customer.use-case';
import { DeleteCustomerDocs } from './docs';

@ApiTags('Customers')
@ApiCookieAuth()
@TenantScoped()
@Controller('customers')
export class DeleteCustomerController {
	constructor(
		@Inject(DeleteCustomerUseCase)
		private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
	) {}

	@Delete(':id')
	@Roles(OrganizationRole.OWNER)
	@DeleteCustomerDocs()
	async execute(@ActiveOrganizationId() organizationId: string, @Param('id') id: string): Promise<void> {
		return await this.deleteCustomerUseCase.execute(id, organizationId);
	}
}
