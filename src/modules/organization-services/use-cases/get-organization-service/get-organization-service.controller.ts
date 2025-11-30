import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrganizationService } from '../../models/entities/organization-service.entity';
import { GetOrganizationServiceDocs } from './docs';
import { GetOrganizationServiceUseCase } from './get-organization-service.use-case';

@ApiTags('Organization Services')
@Controller('organization-services')
export class GetOrganizationServiceController {
	constructor(
		@Inject(GetOrganizationServiceUseCase)
		private readonly getOrganizationServiceUseCase: GetOrganizationServiceUseCase,
	) {}

	@Get(':id')
	@GetOrganizationServiceDocs()
	async execute(@Param('id') id: string): Promise<OrganizationService> {
		return await this.getOrganizationServiceUseCase.execute(id);
	}
}
