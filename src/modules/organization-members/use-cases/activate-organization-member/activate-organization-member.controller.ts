import { Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/modules/auth/shared/decorators/roles.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { OrganizationRole } from '@/shared/constants/organization-roles';
import { ActivateOrganizationMemberUseCase } from './activate-organization-member.use-case';
import { ActivateOrganizationMemberDocs } from './docs';

@ApiTags('Organization Members')
@ApiCookieAuth()
@TenantScoped()
@Controller('organization-members')
export class ActivateOrganizationMemberController {
	constructor(
		@Inject(ActivateOrganizationMemberUseCase)
		private readonly activateOrganizationMemberUseCase: ActivateOrganizationMemberUseCase,
	) {}

	@Patch(':id/activate')
	@Roles(OrganizationRole.OWNER)
	@ActivateOrganizationMemberDocs()
	async execute(@Param('id') id: string): Promise<void> {
		return await this.activateOrganizationMemberUseCase.execute(id);
	}
}
