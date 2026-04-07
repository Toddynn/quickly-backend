import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { Roles } from '@/modules/auth/shared/decorators/roles.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { OrganizationRole } from '@/shared/constants/organization-roles';
import type { LinkCustomerToUserDto } from '../../models/dto/input/link-customer-to-user.dto';
import { Customer } from '../../models/entities/customer.entity';
import { LinkCustomerToUserDocs } from './docs';
import { LinkCustomerToUserUseCase } from './link-customer-to-user.use-case';

@ApiTags('Customers')
@ApiBearerAuth()
@TenantScoped()
@Controller('customers')
export class LinkCustomerToUserController {
	constructor(
		@Inject(LinkCustomerToUserUseCase)
		private readonly linkCustomerToUserUseCase: LinkCustomerToUserUseCase,
	) {}

	@Patch(':id/link-user')
	@Roles(OrganizationRole.OWNER)
	@LinkCustomerToUserDocs()
	async execute(
		@ActiveOrganizationId() organizationId: string,
		@Param('id') id: string,
		@Body() linkCustomerToUserDto: LinkCustomerToUserDto,
	): Promise<Customer> {
		return await this.linkCustomerToUserUseCase.execute(id, organizationId, linkCustomerToUserDto);
	}
}
