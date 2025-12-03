import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';
import { UpdateOrganizationDto } from '../../models/dto/input/update-organization.dto';
import { UpdateOrganizationDocs } from './docs';
import { UpdateOrganizationUseCase } from './update-organization.use-case';

@ApiTags('Organizations')
@Controller('organizations')
export class UpdateOrganizationController {
	constructor(
		@Inject(UpdateOrganizationUseCase)
		private readonly updateOrganizationUseCase: UpdateOrganizationUseCase,
	) {}

	@Patch(':id')
	@UpdateOrganizationDocs()
	async execute(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto): Promise<UpdateResult> {
		return await this.updateOrganizationUseCase.execute(id, updateOrganizationDto);
	}
}
