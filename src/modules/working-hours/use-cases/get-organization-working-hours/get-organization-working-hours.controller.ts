import { Controller, Get, Inject } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { WorkingHoursDto } from '../../models/dto/output/working-hours.dto';
import { GetOrganizationWorkingHoursDocs } from './docs';
import { GetOrganizationWorkingHoursUseCase } from './get-organization-working-hours.use-case';

@ApiTags('Working Hours')
@ApiCookieAuth()
@TenantScoped()
@Controller('organizations/working-hours')
export class GetOrganizationWorkingHoursController {
	constructor(
		@Inject(GetOrganizationWorkingHoursUseCase)
		private readonly getOrganizationWorkingHoursUseCase: GetOrganizationWorkingHoursUseCase,
	) {}

	@Get()
	@GetOrganizationWorkingHoursDocs()
	async execute(@ActiveOrganizationId() organizationId: string): Promise<WorkingHoursDto[]> {
		return this.getOrganizationWorkingHoursUseCase.execute(organizationId);
	}
}
