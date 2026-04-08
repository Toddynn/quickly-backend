import { Controller, Delete, Inject } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { SessionUser } from '@/modules/auth/models/interfaces/session-user.interface';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { CurrentUser } from '@/modules/auth/shared/decorators/current-user.decorator';
import { Roles } from '@/modules/auth/shared/decorators/roles.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { OrganizationRole } from '@/shared/constants/organization-roles';
import { DeleteOrganizationUseCase } from './delete-organization.use-case';
import { DeleteOrganizationDocs } from './docs';

@ApiTags('Organizations')
@ApiCookieAuth()
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
	async execute(@ActiveOrganizationId() organizationId: string, @CurrentUser() currentUser: SessionUser): Promise<void> {
		return await this.deleteOrganizationUseCase.execute(organizationId, currentUser.userId);
	}
}
