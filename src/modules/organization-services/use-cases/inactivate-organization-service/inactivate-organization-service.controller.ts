import { Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { UpdateResult } from 'typeorm';
import { InactivateOrganizationServiceDocs } from './docs';
import { InactivateOrganizationServiceUseCase } from './inactivate-organization-service.use-case';

@ApiTags('Organization Services')
@Controller('organization-services')
export class InactivateOrganizationServiceController {
	constructor(
		@Inject(InactivateOrganizationServiceUseCase)
		private readonly inactivateOrganizationServiceUseCase: InactivateOrganizationServiceUseCase,
	) {}

	@Patch(':id/inactivate')
	@InactivateOrganizationServiceDocs()
	async execute(@Param('id') id: string): Promise<UpdateResult> {
		return await this.inactivateOrganizationServiceUseCase.execute(id);
	}
}
