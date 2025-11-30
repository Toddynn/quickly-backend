import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { CreateOrganizationDto } from '../../models/dto/create-organization.dto';
import type { Organization } from '../../models/entities/organization.entity';
import { CreateOrganizationUseCase } from './create-organization.use-case';
import { CreateOrganizationDocs } from './docs';

@ApiTags('Organizations')
@Controller('organizations')
export class CreateOrganizationController {
	constructor(
		@Inject(CreateOrganizationUseCase)
		private readonly createOrganizationUseCase: CreateOrganizationUseCase,
	) {}

	@Post()
	@CreateOrganizationDocs()
	async execute(@Body() createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
		return await this.createOrganizationUseCase.execute(createOrganizationDto);
	}
}
