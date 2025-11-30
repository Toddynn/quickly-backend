import { Controller, Delete, Inject, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteOrganizationUseCase } from './delete-organization.use-case';
import { DeleteOrganizationDocs } from './docs';

@ApiTags('Organizations')
@Controller('organizations')
export class DeleteOrganizationController {
	constructor(
		@Inject(DeleteOrganizationUseCase)
		private readonly deleteOrganizationUseCase: DeleteOrganizationUseCase,
	) {}

	@Delete(':id')
	@DeleteOrganizationDocs()
	async execute(@Param('id') id: string): Promise<void> {
		return await this.deleteOrganizationUseCase.execute(id);
	}
}
