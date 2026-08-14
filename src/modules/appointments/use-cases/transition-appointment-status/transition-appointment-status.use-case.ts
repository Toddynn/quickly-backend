import { Inject, Injectable } from '@nestjs/common';
import { InvalidAppointmentStatusTransitionException } from '../../errors/invalid-appointment-status-transition.error';
import type { Appointment } from '../../models/entities/appointments.entity';
import type { AppointmentsRepositoryInterface } from '../../models/interfaces/repository.interface';
import type { APPOINTMENT_STATUS } from '../../shared/interfaces/appointment-status';
import { ALLOWED_STATUS_TRANSITIONS } from '../../shared/constants/allowed-status-transitions';
import { APPOINTMENT_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { GetExistingAppointmentUseCase } from '../get-existing-appointment/get-existing-appointment.use-case';

@Injectable()
export class TransitionAppointmentStatusUseCase {
	constructor(
		@Inject(APPOINTMENT_REPOSITORY_INTERFACE_KEY)
		private readonly appointmentsRepository: AppointmentsRepositoryInterface,
		@Inject(GetExistingAppointmentUseCase)
		private readonly getExistingAppointmentUseCase: GetExistingAppointmentUseCase,
	) {}

	async execute(organizationId: string, appointmentId: string, targetStatus: APPOINTMENT_STATUS): Promise<Appointment> {
		const appointment = await this.getExistingAppointmentUseCase.execute({
			where: { id: appointmentId, organization_id: organizationId },
		});

		const allowedTargets = ALLOWED_STATUS_TRANSITIONS[appointment.status];
		if (!allowedTargets.includes(targetStatus)) {
			throw new InvalidAppointmentStatusTransitionException(appointment.status, targetStatus);
		}

		appointment.status = targetStatus;
		return this.appointmentsRepository.save(appointment);
	}
}
