import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { CurrentUser } from '@/modules/auth/shared/decorators/current-user.decorator';
import { Roles } from '@/modules/auth/shared/decorators/roles.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import type { JwtPayload } from '@/modules/auth/strategies/jwt.strategy';
import { OrganizationRole } from '@/shared/constants/organization-roles';
import { CreateOrganizationInviteDto } from '../../models/dto/input/create-organization-invite.dto';
import { OrganizationInvite } from '../../models/entities/organization-invite.entity';
import { CreateOrganizationInviteUseCase } from './create-organization-invite.use-case';
import { CreateOrganizationInviteDocs } from './docs';

@ApiTags('Organization Invites')
@ApiBearerAuth()
@TenantScoped()
@Controller('organization-invites')
export class CreateOrganizationInviteController {
	constructor(
		@Inject(CreateOrganizationInviteUseCase)
		private readonly createOrganizationInviteUseCase: CreateOrganizationInviteUseCase,
	) {}

	@Post()
	@Roles(OrganizationRole.OWNER)
	@CreateOrganizationInviteDocs()
	async execute(
		@ActiveOrganizationId() organizationId: string,
		@CurrentUser() currentUser: JwtPayload,
		@Body() createOrganizationInviteDto: CreateOrganizationInviteDto,
	): Promise<OrganizationInvite> {
		return await this.createOrganizationInviteUseCase.execute({
			...createOrganizationInviteDto,
			organization_id: organizationId,
			inviter_id: currentUser.sub,
		});
	}
}
