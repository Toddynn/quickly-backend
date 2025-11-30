import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { UpdateResult } from 'typeorm';
import { UpdateOrganizationServiceDto } from '../../models/dto/update-organization-service.dto';
import { UpdateOrganizationServiceDocs } from './docs';
import { UpdateOrganizationServiceUseCase } from './update-organization-service.use-case';

@ApiTags('Organization Services')
@Controller('organization-services')
export class UpdateOrganizationServiceController {
	constructor(
		@Inject(UpdateOrganizationServiceUseCase)
		private readonly updateOrganizationServiceUseCase: UpdateOrganizationServiceUseCase,
	) {}

	@Patch(':id')
	@UpdateOrganizationServiceDocs()
	async execute(@Param('id') id: string, @Body() updateOrganizationServiceDto: UpdateOrganizationServiceDto): Promise<UpdateResult> {
		return await this.updateOrganizationServiceUseCase.execute(id, updateOrganizationServiceDto);
	}
}
