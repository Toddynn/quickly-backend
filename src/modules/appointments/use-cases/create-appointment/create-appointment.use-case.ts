import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { GetExistingCustomerUseCase } from '@/modules/customer/use-cases/get-existing-customer/get-existing-customer.use-case';
import { GetExistingOrganizationMemberUseCase } from '@/modules/organization-members/use-cases/get-existing-organization-member/get-existing-organization-member.use-case';
import { GetExistingOrganizationServiceUseCase } from '@/modules/organization-services/use-cases/get-existing-organization-service/get-existing-organization-service.use-case';
import { GetProfessionalAvailabilityWindowUseCase } from '@/modules/working-hours/use-cases/get-professional-availability-window/get-professional-availability-window.use-case';
import { AppointmentOutsideWorkingHoursException } from '../../errors/appointment-outside-working-hours.error';
import { AppointmentTimeConflictException } from '../../errors/appointment-time-conflict.error';
import type { CreateAppointmentDto } from '../../models/dto/input/create-appointment.dto';
import { Appointment } from '../../models/entities/appointments.entity';
import { APPOINTMENT_STATUS } from '../../shared/interfaces/appointment-status';

const EXCLUDED_STATUSES = [APPOINTMENT_STATUS.CANCELED, APPOINTMENT_STATUS.NO_SHOW];

@Injectable()
export class CreateAppointmentUseCase {
	constructor(
		@Inject(DataSource) private readonly dataSource: DataSource,
		@Inject(GetExistingOrganizationServiceUseCase)
		private readonly getExistingOrganizationServiceUseCase: GetExistingOrganizationServiceUseCase,
		@Inject(GetExistingCustomerUseCase)
		private readonly getExistingCustomerUseCase: GetExistingCustomerUseCase,
		@Inject(GetExistingOrganizationMemberUseCase)
		private readonly getExistingOrganizationMemberUseCase: GetExistingOrganizationMemberUseCase,
		@Inject(GetProfessionalAvailabilityWindowUseCase)
		private readonly getProfessionalAvailabilityWindowUseCase: GetProfessionalAvailabilityWindowUseCase,
	) {}

	async execute(organizationId: string, dto: CreateAppointmentDto): Promise<Appointment> {
		const [service, customer, professional] = await Promise.all([
			this.getExistingOrganizationServiceUseCase.execute({
				where: { id: dto.organization_service_id, organization_id: organizationId, active: true },
			}),
			this.getExistingCustomerUseCase.execute({ where: { id: dto.customer_id, organization_id: organizationId } }),
			this.getExistingOrganizationMemberUseCase.execute({ where: { id: dto.professional_id, organization_id: organizationId, active: true } }),
		]);

		const appointmentDate = new Date(dto.appointment_date);
		const dateOnly = dto.appointment_date.slice(0, 10);
		const appointmentEnd = new Date(appointmentDate.getTime() + service.duration_minutes * 60_000);

		const window = await this.getProfessionalAvailabilityWindowUseCase.execute(professional.id, organizationId, dateOnly);
		if (!window.available || !window.start_time || !window.end_time) {
			throw new AppointmentOutsideWorkingHoursException();
		}

		const windowStart = new Date(`${dateOnly}T${window.start_time}-03:00`);
		const windowEnd = new Date(`${dateOnly}T${window.end_time}-03:00`);
		if (appointmentDate < windowStart || appointmentEnd > windowEnd) {
			throw new AppointmentOutsideWorkingHoursException();
		}

		return this.dataSource.transaction(async (manager) => {
			// Serializa criações concorrentes pro mesmo profissional — fecha a race condition
			// entre o SELECT de conflito e o INSERT. Sem isso, dois requests simultâneos podem
			// passar o SELECT ao mesmo tempo e criar dois agendamentos sobrepostos.
			await manager.query('SELECT pg_advisory_xact_lock(hashtext($1))', [professional.id]);

			const conflict = await manager
				.createQueryBuilder(Appointment, 'appointment')
				.where('appointment.professional_id = :professionalId', { professionalId: professional.id })
				.andWhere('appointment.status NOT IN (:...excludedStatuses)', { excludedStatuses: EXCLUDED_STATUSES })
				.andWhere('appointment.appointment_date < :appointmentEnd', { appointmentEnd })
				.andWhere("appointment.appointment_date + (appointment.duration_minutes || ' minutes')::interval > :appointmentDate", { appointmentDate })
				.getOne();

			if (conflict) throw new AppointmentTimeConflictException();

			const appointment = manager.create(Appointment, {
				organization_id: organizationId,
				professional_id: professional.id,
				customer_id: customer.id,
				organization_service_id: service.id,
				appointment_date: appointmentDate,
				duration_minutes: service.duration_minutes,
				price: service.price,
				status: APPOINTMENT_STATUS.PENDING,
			});

			return manager.save(appointment);
		});
	}
}
