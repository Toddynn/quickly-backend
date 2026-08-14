import { Body, Controller, Inject, Param, Put } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { SessionUser } from '@/modules/auth/models/interfaces/session-user.interface';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { CurrentUser } from '@/modules/auth/shared/decorators/current-user.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { SetWorkingHoursDto } from '../../models/dto/input/set-working-hours.dto';
import { ProfessionalWorkingHours } from '../../models/entities/professional-working-hours.entity';
import { SetProfessionalWorkingHoursDocs } from './docs';
import { SetProfessionalWorkingHoursUseCase } from './set-professional-working-hours.use-case';

@ApiTags('Working Hours')
@ApiCookieAuth()
@TenantScoped()
@Controller('organization-members/:professionalId/working-hours')
export class SetProfessionalWorkingHoursController {
	constructor(
		@Inject(SetProfessionalWorkingHoursUseCase)
		private readonly setProfessionalWorkingHoursUseCase: SetProfessionalWorkingHoursUseCase,
	) {}

	@Put()
	@SetProfessionalWorkingHoursDocs()
	async execute(
		@Param('professionalId') professionalId: string,
		@ActiveOrganizationId() organizationId: string,
		@Body() dto: SetWorkingHoursDto,
		@CurrentUser() currentUser: SessionUser,
	): Promise<ProfessionalWorkingHours[]> {
		return this.setProfessionalWorkingHoursUseCase.execute(professionalId, organizationId, dto, currentUser);
	}
}
