import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrganizationServiceDto } from '../../models/dto/input/create-organization-service.dto';
import { OrganizationService } from '../../models/entities/organization-service.entity';
import { CreateOrganizationServiceUseCase } from './create-organization-service.use-case';
import { CreateOrganizationServiceDocs } from './docs';

@ApiTags('Organization Services')
@Controller('organization-services')
export class CreateOrganizationServiceController {
	constructor(
		@Inject(CreateOrganizationServiceUseCase)
		private readonly createOrganizationServiceUseCase: CreateOrganizationServiceUseCase,
	) {}

	@Post()
	@CreateOrganizationServiceDocs()
	async execute(@Body() createOrganizationServiceDto: CreateOrganizationServiceDto): Promise<OrganizationService> {
		return await this.createOrganizationServiceUseCase.execute(createOrganizationServiceDto);
	}
}
