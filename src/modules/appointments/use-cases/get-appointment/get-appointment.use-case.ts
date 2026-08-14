import { Inject, Injectable } from '@nestjs/common';
import type { Appointment } from '../../models/entities/appointments.entity';
import { GetExistingAppointmentUseCase } from '../get-existing-appointment/get-existing-appointment.use-case';

@Injectable()
export class GetAppointmentUseCase {
	constructor(
		@Inject(GetExistingAppointmentUseCase)
		private readonly getExistingAppointmentUseCase: GetExistingAppointmentUseCase,
	) {}

	async execute(id: string, organizationId: string): Promise<Appointment> {
		return this.getExistingAppointmentUseCase.execute({ where: { id, organization_id: organizationId } });
	}
}
