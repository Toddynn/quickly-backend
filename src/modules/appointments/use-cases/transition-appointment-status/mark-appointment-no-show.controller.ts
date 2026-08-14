import { Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { Appointment } from '../../models/entities/appointments.entity';
import { APPOINTMENT_STATUS } from '../../shared/interfaces/appointment-status';
import { TransitionAppointmentStatusDocs } from './docs';
import { TransitionAppointmentStatusUseCase } from './transition-appointment-status.use-case';

@ApiTags('Appointments')
@ApiCookieAuth()
@TenantScoped()
@Controller('appointments')
export class MarkAppointmentNoShowController {
	constructor(
		@Inject(TransitionAppointmentStatusUseCase)
		private readonly transitionAppointmentStatusUseCase: TransitionAppointmentStatusUseCase,
	) {}

	@Patch(':id/no-show')
	@TransitionAppointmentStatusDocs('no-show')
	async execute(@Param('id') id: string, @ActiveOrganizationId() organizationId: string): Promise<Appointment> {
		return this.transitionAppointmentStatusUseCase.execute(organizationId, id, APPOINTMENT_STATUS.NO_SHOW);
	}
}
