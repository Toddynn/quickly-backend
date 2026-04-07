import { Controller, Delete, Inject, Param } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/modules/auth/shared/decorators/roles.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { OrganizationRole } from '@/shared/constants/organization-roles';
import { DeleteOrganizationMemberUseCase } from './delete-organization-member.use-case';
import { DeleteOrganizationMemberDocs } from './docs';

@ApiTags('Organization Members')
@ApiCookieAuth()
@TenantScoped()
@Controller('organization-members')
export class DeleteOrganizationMemberController {
	constructor(
		@Inject(DeleteOrganizationMemberUseCase)
		private readonly deleteOrganizationMemberUseCase: DeleteOrganizationMemberUseCase,
	) {}

	@Delete(':id')
	@Roles(OrganizationRole.OWNER)
	@DeleteOrganizationMemberDocs()
	async execute(@Param('id') id: string): Promise<void> {
		return await this.deleteOrganizationMemberUseCase.execute(id);
	}
}
