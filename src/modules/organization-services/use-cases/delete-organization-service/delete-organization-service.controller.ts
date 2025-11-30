import { Controller, Delete, Inject, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteOrganizationServiceUseCase } from './delete-organization-service.use-case';
import { DeleteOrganizationServiceDocs } from './docs';

@ApiTags('Organization Services')
@Controller('organization-services')
export class DeleteOrganizationServiceController {
	constructor(
		@Inject(DeleteOrganizationServiceUseCase)
		private readonly deleteOrganizationServiceUseCase: DeleteOrganizationServiceUseCase,
	) {}

	@Delete(':id')
	@DeleteOrganizationServiceDocs()
	async execute(@Param('id') id: string): Promise<void> {
		return await this.deleteOrganizationServiceUseCase.execute(id);
	}
}
