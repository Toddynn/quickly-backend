import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListOrganizationServicesDto } from '../../models/dto/input/list-organization-services.dto';
import { ListOrganizationServiceResponseDto } from '../../models/dto/output/list-organization-service-response.dto';
import { ListOrganizationServicesDocs } from './docs';
import { ListOrganizationServicesUseCase } from './list-organization-services.use-case';

@ApiTags('Organization Services')
@Controller('organization-services')
export class ListOrganizationServicesController {
	constructor(
		@Inject(ListOrganizationServicesUseCase)
		private readonly listOrganizationServicesUseCase: ListOrganizationServicesUseCase,
	) {}

	@Get()
	@ListOrganizationServicesDocs()
	async execute(@Query() listDto: ListOrganizationServicesDto): Promise<PaginatedResponseDto<ListOrganizationServiceResponseDto>> {
		return await this.listOrganizationServicesUseCase.execute(listDto);
	}
}
