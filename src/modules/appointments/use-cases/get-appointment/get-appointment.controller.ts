import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { Appointment } from '../../models/entities/appointments.entity';
import { GetAppointmentDocs } from './docs';
import { GetAppointmentUseCase } from './get-appointment.use-case';

@ApiTags('Appointments')
@ApiCookieAuth()
@TenantScoped()
@Controller('appointments')
export class GetAppointmentController {
	constructor(
		@Inject(GetAppointmentUseCase)
		private readonly getAppointmentUseCase: GetAppointmentUseCase,
	) {}

	@Get(':id')
	@GetAppointmentDocs()
	async execute(@Param('id') id: string, @ActiveOrganizationId() organizationId: string): Promise<Appointment> {
		return this.getAppointmentUseCase.execute(id, organizationId);
	}
}
