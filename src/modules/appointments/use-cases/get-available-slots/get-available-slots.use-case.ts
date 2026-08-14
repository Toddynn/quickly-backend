import { Inject, Injectable } from '@nestjs/common';
import { GetExistingOrganizationServiceUseCase } from '@/modules/organization-services/use-cases/get-existing-organization-service/get-existing-organization-service.use-case';
import { GetProfessionalAvailabilityWindowUseCase } from '@/modules/working-hours/use-cases/get-professional-availability-window/get-professional-availability-window.use-case';
import type { AppointmentsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { APPOINTMENT_STATUS } from '../../shared/interfaces/appointment-status';
import { APPOINTMENT_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

export interface Slot {
	start: string;
	end: string;
}

const EXCLUDED_STATUSES = [APPOINTMENT_STATUS.CANCELED, APPOINTMENT_STATUS.NO_SHOW];

@Injectable()
export class GetAvailableSlotsUseCase {
	constructor(
		@Inject(APPOINTMENT_REPOSITORY_INTERFACE_KEY)
		private readonly appointmentsRepository: AppointmentsRepositoryInterface,
		@Inject(GetExistingOrganizationServiceUseCase)
		private readonly getExistingOrganizationServiceUseCase: GetExistingOrganizationServiceUseCase,
		@Inject(GetProfessionalAvailabilityWindowUseCase)
		private readonly getProfessionalAvailabilityWindowUseCase: GetProfessionalAvailabilityWindowUseCase,
	) {}

	async execute(organizationId: string, professionalId: string, organizationServiceId: string, date: string): Promise<Slot[]> {
		const service = await this.getExistingOrganizationServiceUseCase.execute({
			where: { id: organizationServiceId, organization_id: organizationId },
		});

		const window = await this.getProfessionalAvailabilityWindowUseCase.execute(professionalId, organizationId, date);
		if (!window.available || !window.start_time || !window.end_time) return [];

		const durationMs = service.duration_minutes * 60_000;
		const windowStart = new Date(`${date}T${window.start_time}-03:00`);
		const windowEnd = new Date(`${date}T${window.end_time}-03:00`);

		const existingAppointments = await this.appointmentsRepository
			.createQueryBuilder('appointment')
			.where('appointment.professional_id = :professionalId', { professionalId })
			.andWhere('appointment.status NOT IN (:...excludedStatuses)', { excludedStatuses: EXCLUDED_STATUSES })
			.andWhere('appointment.appointment_date < :windowEnd', { windowEnd })
			.andWhere("appointment.appointment_date + (appointment.duration_minutes || ' minutes')::interval > :windowStart", { windowStart })
			.getMany();

		const slots: Slot[] = [];
		for (let slotStart = windowStart; slotStart.getTime() + durationMs <= windowEnd.getTime(); slotStart = new Date(slotStart.getTime() + durationMs)) {
			const slotEnd = new Date(slotStart.getTime() + durationMs);

			const overlaps = existingAppointments.some((appointment) => {
				const apptStart = appointment.appointment_date.getTime();
				const apptEnd = apptStart + appointment.duration_minutes * 60_000;
				return slotStart.getTime() < apptEnd && apptStart < slotEnd.getTime();
			});

			if (!overlaps) slots.push({ start: slotStart.toISOString(), end: slotEnd.toISOString() });
		}

		return slots;
	}
}
