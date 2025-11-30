import { Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CancelOrganizationInviteUseCase } from './cancel-organization-invite.use-case';
import { CancelOrganizationInviteDocs } from './docs';

@ApiTags('Organization Invites')
@Controller('organization-invites')
export class CancelOrganizationInviteController {
	constructor(
		@Inject(CancelOrganizationInviteUseCase)
		private readonly cancelOrganizationInviteUseCase: CancelOrganizationInviteUseCase,
	) {}

	@Patch(':id/cancel')
	@CancelOrganizationInviteDocs()
	async execute(@Param('id') id: string): Promise<void> {
		return await this.cancelOrganizationInviteUseCase.execute(id);
	}
}
