import { Injectable } from '@nestjs/common';
import { CannotDeleteServiceWithFutureAppointmentsException } from '../../errors/cannot-delete-service-with-future-appointments.error';

@Injectable()
export class CheckFutureAppointmentsUseCase {
	execute(hasFutureAppointments: boolean): void {
		if (hasFutureAppointments) {
			throw new CannotDeleteServiceWithFutureAppointmentsException();
		}
	}
}
