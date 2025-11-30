import { Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { UpdateResult } from 'typeorm';
import { ActivateOrganizationServiceUseCase } from './activate-organization-service.use-case';
import { ActivateOrganizationServiceDocs } from './docs';

@ApiTags('Organization Services')
@Controller('organization-services')
export class ActivateOrganizationServiceController {
	constructor(
		@Inject(ActivateOrganizationServiceUseCase)
		private readonly activateOrganizationServiceUseCase: ActivateOrganizationServiceUseCase,
	) {}

	@Patch(':id/activate')
	@ActivateOrganizationServiceDocs()
	async execute(@Param('id') id: string): Promise<UpdateResult> {
		return await this.activateOrganizationServiceUseCase.execute(id);
	}
}
