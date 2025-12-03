import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrganizationInviteDto } from '../../models/dto/input/create-organization-invite.dto';
import { OrganizationInvite } from '../../models/entities/organization-invite.entity';
import { CreateOrganizationInviteUseCase } from './create-organization-invite.use-case';
import { CreateOrganizationInviteDocs } from './docs';

@ApiTags('Organization Invites')
@Controller('organization-invites')
export class CreateOrganizationInviteController {
	constructor(
		@Inject(CreateOrganizationInviteUseCase)
		private readonly createOrganizationInviteUseCase: CreateOrganizationInviteUseCase,
	) {}

	@Post()
	@CreateOrganizationInviteDocs()
	async execute(@Body() createOrganizationInviteDto: CreateOrganizationInviteDto): Promise<OrganizationInvite> {
		return await this.createOrganizationInviteUseCase.execute(createOrganizationInviteDto);
	}
}
