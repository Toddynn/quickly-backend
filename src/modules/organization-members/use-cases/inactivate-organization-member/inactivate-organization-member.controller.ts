import { Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/modules/auth/shared/decorators/roles.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { OrganizationRole } from '@/shared/constants/organization-roles';
import { InactivateOrganizationMemberDocs } from './docs';
import { InactivateOrganizationMemberUseCase } from './inactivate-organization-member.use-case';

@ApiTags('Organization Members')
@ApiBearerAuth()
@TenantScoped()
@Controller('organization-members')
export class InactivateOrganizationMemberController {
	constructor(
		@Inject(InactivateOrganizationMemberUseCase)
		private readonly inactivateOrganizationMemberUseCase: InactivateOrganizationMemberUseCase,
	) {}

	@Patch(':id/inactivate')
	@Roles(OrganizationRole.OWNER)
	@InactivateOrganizationMemberDocs()
	async execute(@Param('id') id: string): Promise<void> {
		return await this.inactivateOrganizationMemberUseCase.execute(id);
	}
}
