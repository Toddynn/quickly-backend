import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
	async execute(@Param('id') id: string, @Body('user_id') userId: string): Promise<{ message: string }> {
		return await this.acceptOrganizationInviteUseCase.execute(id, userId);
	}
}
