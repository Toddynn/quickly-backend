import { Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActivateOrganizationMemberUseCase } from './activate-organization-member.use-case';
import { ActivateOrganizationMemberDocs } from './docs';

@ApiTags('Organization Members')
@Controller('organization-members')
export class ActivateOrganizationMemberController {
	constructor(
		@Inject(ActivateOrganizationMemberUseCase)
		private readonly activateOrganizationMemberUseCase: ActivateOrganizationMemberUseCase,
	) {}

	@Patch(':id/activate')
	@ActivateOrganizationMemberDocs()
	async execute(@Param('id') id: string): Promise<void> {
		return await this.activateOrganizationMemberUseCase.execute(id);
	}
}
