import { Controller, Delete, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { Roles } from '@/modules/auth/shared/decorators/roles.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { OrganizationRole } from '@/shared/constants/organization-roles';
import { DeleteOrganizationUseCase } from './delete-organization.use-case';
import { DeleteOrganizationDocs } from './docs';

@ApiTags('Organizations')
@TenantScoped()
@Controller('organizations')
export class DeleteOrganizationController {
	constructor(
		@Inject(DeleteOrganizationUseCase)
		private readonly deleteOrganizationUseCase: DeleteOrganizationUseCase,
	) {}

	@Delete()
	@Roles(OrganizationRole.OWNER)
	@DeleteOrganizationDocs()
	async execute(@ActiveOrganizationId() organizationId: string): Promise<void> {
		return await this.deleteOrganizationUseCase.execute(organizationId);
	}
}
