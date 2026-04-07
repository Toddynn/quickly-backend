import { Body, Controller, Inject, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { Roles } from '@/modules/auth/shared/decorators/roles.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { OrganizationRole } from '@/shared/constants/organization-roles';
import { UpdateOrganizationDto } from '../../models/dto/input/update-organization.dto';
import { UpdateOrganizationDocs } from './docs';
import { UpdateOrganizationUseCase } from './update-organization.use-case';

@ApiTags('Organizations')
@TenantScoped()
@Controller('organizations')
export class UpdateOrganizationController {
	constructor(
		@Inject(UpdateOrganizationUseCase)
		private readonly updateOrganizationUseCase: UpdateOrganizationUseCase,
	) {}

	@Patch()
	@Roles(OrganizationRole.OWNER)
	@UpdateOrganizationDocs()
	async execute(@ActiveOrganizationId() organizationId: string, @Body() updateOrganizationDto: UpdateOrganizationDto): Promise<UpdateResult> {
		return await this.updateOrganizationUseCase.execute(organizationId, updateOrganizationDto);
	}
}
