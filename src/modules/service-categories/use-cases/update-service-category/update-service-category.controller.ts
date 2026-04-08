import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { UpdateServiceCategoryDto } from '../../models/dto/input/update-service-category.dto';
import { UpdateServiceCategoryDocs } from './docs';
import { UpdateServiceCategoryUseCase } from './update-service-category.use-case';

@ApiTags('Service Categories')
@ApiCookieAuth()
@TenantScoped()
@Controller('service-categories')
export class UpdateServiceCategoryController {
	constructor(
		@Inject(UpdateServiceCategoryUseCase)
		private readonly updateServiceCategoryUseCase: UpdateServiceCategoryUseCase,
	) {}

	@Patch(':id')
	@UpdateServiceCategoryDocs()
	async execute(
		@ActiveOrganizationId() organization_id: string,
		@Param('id') id: string,
		@Body() updateServiceCategoryDto: UpdateServiceCategoryDto,
	): Promise<UpdateResult> {
		return await this.updateServiceCategoryUseCase.execute(id, organization_id, updateServiceCategoryDto);
	}
}
