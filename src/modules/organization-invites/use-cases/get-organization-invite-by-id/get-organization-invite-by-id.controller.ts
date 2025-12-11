import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrganizationInvite } from '../../models/entities/organization-invite.entity';
import { GetOrganizationInviteByIdDocs } from './docs';
import { GetOrganizationInviteByIdUseCase } from './get-organization-invite-by-id.use-case';

@ApiTags('Organization Invites')
@Controller('organization-invites')
export class GetOrganizationInviteByIdController {
	constructor(
		@Inject(GetOrganizationInviteByIdUseCase)
		private readonly getOrganizationInviteByIdUseCase: GetOrganizationInviteByIdUseCase,
	) {}

	@Get(':id')
	@GetOrganizationInviteByIdDocs()
	async execute(@Param('id') id: string): Promise<OrganizationInvite> {
		return await this.getOrganizationInviteByIdUseCase.execute(id);
	}
}

