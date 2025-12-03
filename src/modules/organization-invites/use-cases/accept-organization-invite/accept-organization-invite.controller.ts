import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AcceptOrganizationInviteDto } from '../../models/dto/input/accept-organization-invite.dto';
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
	async execute(@Param('id') id: string, @Body() acceptOrganizationInviteDto: AcceptOrganizationInviteDto): Promise<AcceptOrganizationInviteResponseDto> {
		return await this.acceptOrganizationInviteUseCase.execute(id, acceptOrganizationInviteDto.user_id);
	}
}
