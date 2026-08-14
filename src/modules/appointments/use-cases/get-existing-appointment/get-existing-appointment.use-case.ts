import { Inject, Injectable } from '@nestjs/common';
import type { FindOneOptions } from 'typeorm';
import { formatWhereClause } from '@/shared/helpers/format-where-clause.helper';
import { normalizeGetExistingOptions } from '@/shared/helpers/normalize-get-existing-options.helper';
import type { GetExistingOptions } from '@/shared/interfaces/get-existing-options';
import { NotFoundAppointmentException } from '../../errors/not-found-appointment.error';
import type { Appointment } from '../../models/entities/appointments.entity';
import type { AppointmentsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { APPOINTMENT_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class GetExistingAppointmentUseCase {
	constructor(
		@Inject(APPOINTMENT_REPOSITORY_INTERFACE_KEY)
		private readonly appointmentsRepository: AppointmentsRepositoryInterface,
	) {}

	async execute(criteria: FindOneOptions<Appointment>, options: GetExistingOptions = {}): Promise<Appointment | null> {
		const { throwIfFound, throwIfNotFound } = normalizeGetExistingOptions(options);
		const fields = formatWhereClause(criteria.where || {});

		const appointment = await this.appointmentsRepository.findOne(criteria);

		if (!appointment) {
			if (throwIfNotFound) throw new NotFoundAppointmentException(fields);
			return null;
		}

		if (throwIfFound) throw new NotFoundAppointmentException(fields);

		return appointment;
	}
}
