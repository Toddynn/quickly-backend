import { Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RejectOrganizationInviteDocs } from './docs';
import { RejectOrganizationInviteUseCase } from './reject-organization-invite.use-case';

@ApiTags('Organization Invites')
@Controller('organization-invites')
export class RejectOrganizationInviteController {
	constructor(
		@Inject(RejectOrganizationInviteUseCase)
		private readonly rejectOrganizationInviteUseCase: RejectOrganizationInviteUseCase,
	) {}

	@Patch(':id/reject')
	@RejectOrganizationInviteDocs()
	async execute(@Param('id') id: string): Promise<void> {
		return await this.rejectOrganizationInviteUseCase.execute(id);
	}
}
