import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { CreateAppointmentDto } from '../../models/dto/input/create-appointment.dto';
import { Appointment } from '../../models/entities/appointments.entity';
import { CreateAppointmentDocs } from './docs';
import { CreateAppointmentUseCase } from './create-appointment.use-case';

@ApiTags('Appointments')
@ApiCookieAuth()
@TenantScoped()
@Controller('appointments')
export class CreateAppointmentController {
	constructor(
		@Inject(CreateAppointmentUseCase)
		private readonly createAppointmentUseCase: CreateAppointmentUseCase,
	) {}

	@Post()
	@CreateAppointmentDocs()
	async execute(@ActiveOrganizationId() organizationId: string, @Body() dto: CreateAppointmentDto): Promise<Appointment> {
		return this.createAppointmentUseCase.execute(organizationId, dto);
	}
}
