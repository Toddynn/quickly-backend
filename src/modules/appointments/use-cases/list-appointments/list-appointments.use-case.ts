import { Inject, Injectable } from '@nestjs/common';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListAppointmentsDto } from '../../models/dto/input/list-appointments.dto';
import type { Appointment } from '../../models/entities/appointments.entity';
import type { AppointmentsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { APPOINTMENT_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class ListAppointmentsUseCase {
	constructor(
		@Inject(APPOINTMENT_REPOSITORY_INTERFACE_KEY)
		private readonly appointmentsRepository: AppointmentsRepositoryInterface,
	) {}

	async execute(organizationId: string, listDto: ListAppointmentsDto): Promise<PaginatedResponseDto<Appointment>> {
		const { page = 1, limit = 10, professional_id, customer_id, status, from_date, to_date } = listDto;
		const skip = (page - 1) * limit;

		const queryBuilder = this.appointmentsRepository
			.createQueryBuilder('appointment')
			.where('appointment.organization_id = :organizationId', { organizationId });

		if (professional_id) queryBuilder.andWhere('appointment.professional_id = :professionalId', { professionalId: professional_id });
		if (customer_id) queryBuilder.andWhere('appointment.customer_id = :customerId', { customerId: customer_id });
		if (status) queryBuilder.andWhere('appointment.status = :status', { status });
		if (from_date) queryBuilder.andWhere('appointment.appointment_date >= :fromDate', { fromDate: from_date });
		if (to_date) queryBuilder.andWhere('appointment.appointment_date <= :toDate', { toDate: to_date });

		queryBuilder.orderBy('appointment.appointment_date', 'ASC').skip(skip).take(limit);

		const [data, total] = await queryBuilder.getManyAndCount();

		return { data, page, limit, total, total_pages: Math.ceil(total / limit) };
	}
}
