import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Organization } from '../../models/entities/organization.entity';
import { GetOrganizationDocs } from './docs';
import { GetOrganizationUseCase } from './get-organization.use-case';

@ApiTags('Organizations')
@Controller('organizations')
export class GetOrganizationController {
	constructor(
		@Inject(GetOrganizationUseCase)
		private readonly getOrganizationUseCase: GetOrganizationUseCase,
	) {}

	@Get(':id')
	@GetOrganizationDocs()
	async execute(@Param('id') id: string): Promise<Organization> {
		return await this.getOrganizationUseCase.execute(id);
	}
}
