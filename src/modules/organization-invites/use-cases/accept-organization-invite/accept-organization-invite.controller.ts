import { Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/modules/auth/shared/decorators/current-user.decorator';
import type { JwtPayload } from '@/modules/auth/strategies/jwt.strategy';
import { AcceptOrganizationInviteResponseDto } from '../../models/dto/output/accept-organization-invite-response.dto';
import { AcceptOrganizationInviteUseCase } from './accept-organization-invite.use-case';
import { AcceptOrganizationInviteDocs } from './docs';

@ApiTags('Organization Invites')
@ApiBearerAuth()
@Controller('organization-invites')
export class AcceptOrganizationInviteController {
	constructor(
		@Inject(AcceptOrganizationInviteUseCase)
		private readonly acceptOrganizationInviteUseCase: AcceptOrganizationInviteUseCase,
	) {}

	@Patch(':id/accept')
	@AcceptOrganizationInviteDocs()
	async execute(@CurrentUser() currentUser: JwtPayload, @Param('id') id: string): Promise<AcceptOrganizationInviteResponseDto> {
		return await this.acceptOrganizationInviteUseCase.execute(id, currentUser.sub);
	}
}
