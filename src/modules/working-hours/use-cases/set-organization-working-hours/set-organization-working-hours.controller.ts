import { Body, Controller, Inject, Put } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { Roles } from '@/modules/auth/shared/decorators/roles.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { OrganizationRole } from '@/shared/constants/organization-roles';
import { SetWorkingHoursDto } from '../../models/dto/input/set-working-hours.dto';
import { OrganizationWorkingHours } from '../../models/entities/organization-working-hours.entity';
import { SetOrganizationWorkingHoursDocs } from './docs';
import { SetOrganizationWorkingHoursUseCase } from './set-organization-working-hours.use-case';

@ApiTags('Working Hours')
@ApiCookieAuth()
@TenantScoped()
@Controller('organizations/working-hours')
export class SetOrganizationWorkingHoursController {
	constructor(
		@Inject(SetOrganizationWorkingHoursUseCase)
		private readonly setOrganizationWorkingHoursUseCase: SetOrganizationWorkingHoursUseCase,
	) {}

	@Roles(OrganizationRole.OWNER)
	@Put()
	@SetOrganizationWorkingHoursDocs()
	async execute(@ActiveOrganizationId() organizationId: string, @Body() dto: SetWorkingHoursDto): Promise<OrganizationWorkingHours[]> {
		return this.setOrganizationWorkingHoursUseCase.execute(organizationId, dto);
	}
}
