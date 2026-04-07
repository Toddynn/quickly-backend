import { Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/modules/auth/shared/decorators/current-user.decorator';
import { SessionUser } from '@/modules/auth/models/interfaces/session-user.interface';
import { AcceptOrganizationInviteResponseDto } from '../../models/dto/output/accept-organization-invite-response.dto';
import { AcceptOrganizationInviteUseCase } from './accept-organization-invite.use-case';
import { AcceptOrganizationInviteDocs } from './docs';

@ApiTags('Organization Invites')
@Controller('organization-invites')
export class AcceptOrganizationInviteController {
	constructor(
		@Inject(AcceptOrganizationInviteUseCase)
		private readonly acceptOrganizationInviteUseCase: AcceptOrganizationInviteUseCase,
	) {}

	@Patch(':id/accept')
	@AcceptOrganizationInviteDocs()
	async execute(@CurrentUser() currentUser: SessionUser, @Param('id') id: string): Promise<AcceptOrganizationInviteResponseDto> {
		return await this.acceptOrganizationInviteUseCase.execute(id, currentUser.userId);
	}
}
