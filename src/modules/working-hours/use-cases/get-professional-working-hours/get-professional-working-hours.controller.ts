import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { WorkingHoursDto } from '../../models/dto/output/working-hours.dto';
import { GetProfessionalWorkingHoursDocs } from './docs';
import { GetProfessionalWorkingHoursUseCase } from './get-professional-working-hours.use-case';

@ApiTags('Working Hours')
@ApiCookieAuth()
@TenantScoped()
@Controller('organization-members/:professionalId/working-hours')
export class GetProfessionalWorkingHoursController {
	constructor(
		@Inject(GetProfessionalWorkingHoursUseCase)
		private readonly getProfessionalWorkingHoursUseCase: GetProfessionalWorkingHoursUseCase,
	) {}

	@Get()
	@GetProfessionalWorkingHoursDocs()
	async execute(@Param('professionalId') professionalId: string): Promise<WorkingHoursDto[]> {
		return this.getProfessionalWorkingHoursUseCase.execute(professionalId);
	}
}
