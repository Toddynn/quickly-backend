import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import { ListAppointmentsDto } from '../../models/dto/input/list-appointments.dto';
import { Appointment } from '../../models/entities/appointments.entity';
import { ListAppointmentsDocs } from './docs';
import { ListAppointmentsUseCase } from './list-appointments.use-case';

@ApiTags('Appointments')
@ApiCookieAuth()
@TenantScoped()
@Controller('appointments')
export class ListAppointmentsController {
	constructor(
		@Inject(ListAppointmentsUseCase)
		private readonly listAppointmentsUseCase: ListAppointmentsUseCase,
	) {}

	@Get()
	@ListAppointmentsDocs()
	async execute(@ActiveOrganizationId() organizationId: string, @Query() listDto: ListAppointmentsDto): Promise<PaginatedResponseDto<Appointment>> {
		return this.listAppointmentsUseCase.execute(organizationId, listDto);
	}
}
