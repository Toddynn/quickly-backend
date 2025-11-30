import { Controller, Delete, Inject, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteOrganizationMemberUseCase } from './delete-organization-member.use-case';
import { DeleteOrganizationMemberDocs } from './docs';

@ApiTags('Organization Members')
@Controller('organization-members')
export class DeleteOrganizationMemberController {
	constructor(
		@Inject(DeleteOrganizationMemberUseCase)
		private readonly deleteOrganizationMemberUseCase: DeleteOrganizationMemberUseCase,
	) {}

	@Delete(':id')
	@DeleteOrganizationMemberDocs()
	async execute(@Param('id') id: string): Promise<void> {
		return await this.deleteOrganizationMemberUseCase.execute(id);
	}
}
