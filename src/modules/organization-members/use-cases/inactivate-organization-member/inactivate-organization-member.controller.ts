import { Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InactivateOrganizationMemberDocs } from './docs';
import { InactivateOrganizationMemberUseCase } from './inactivate-organization-member.use-case';

@ApiTags('Organization Members')
@Controller('organization-members')
export class InactivateOrganizationMemberController {
	constructor(
		@Inject(InactivateOrganizationMemberUseCase)
		private readonly inactivateOrganizationMemberUseCase: InactivateOrganizationMemberUseCase,
	) {}

	@Patch(':id/inactivate')
	@InactivateOrganizationMemberDocs()
	async execute(@Param('id') id: string): Promise<void> {
		return await this.inactivateOrganizationMemberUseCase.execute(id);
	}
}
