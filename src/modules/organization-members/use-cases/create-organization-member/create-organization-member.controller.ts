import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { CreateOrganizationMemberDto } from '../../models/dto/create-organization-member.dto';
import type { OrganizationMember } from '../../models/entities/organization-member.entity';
import { CreateOrganizationMemberUseCase } from './create-organization-member.use-case';
import { CreateOrganizationMemberDocs } from './docs';

@ApiTags('Organization Members')
@Controller('organization-members')
export class CreateOrganizationMemberController {
	constructor(
		@Inject(CreateOrganizationMemberUseCase)
		private readonly createOrganizationMemberUseCase: CreateOrganizationMemberUseCase,
	) {}

	@Post()
	@CreateOrganizationMemberDocs()
	async execute(@Body() createOrganizationMemberDto: CreateOrganizationMemberDto): Promise<OrganizationMember> {
		return await this.createOrganizationMemberUseCase.execute(createOrganizationMemberDto);
	}
}
