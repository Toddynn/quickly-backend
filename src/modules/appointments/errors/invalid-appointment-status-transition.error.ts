import { BadRequestException } from '@nestjs/common';
import type { APPOINTMENT_STATUS } from '../shared/interfaces/appointment-status';

export class InvalidAppointmentStatusTransitionException extends BadRequestException {
	constructor(from: APPOINTMENT_STATUS, to: APPOINTMENT_STATUS) {
		super({ message: `Não é possível mudar o agendamento de "${from}" para "${to}"` });
	}
}
