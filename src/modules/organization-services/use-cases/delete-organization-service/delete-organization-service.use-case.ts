import { Inject, Injectable } from '@nestjs/common';
import { In, MoreThan, Not } from 'typeorm';
import type { AppointmentsRepositoryInterface } from '@/modules/appointments/models/interfaces/repository.interface';
import { APPOINTMENT_REPOSITORY_INTERFACE_KEY } from '@/modules/appointments/shared/constants/repository-interface-key';
import { APPOINTMENT_STATUS } from '@/modules/appointments/shared/interfaces/appointment-status';
import type { OrganizationServicesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_SERVICE_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { CheckFutureAppointmentsUseCase } from '../check-future-appointments/check-future-appointments.use-case';
import { GetExistingOrganizationServiceUseCase } from '../get-existing-organization-service/get-existing-organization-service.use-case';

@Injectable()
export class DeleteOrganizationServiceUseCase {
	constructor(
		@Inject(ORGANIZATION_SERVICE_REPOSITORY_INTERFACE_KEY)
		private readonly organizationServicesRepository: OrganizationServicesRepositoryInterface,
		@Inject(GetExistingOrganizationServiceUseCase)
		private readonly getExistingOrganizationServiceUseCase: GetExistingOrganizationServiceUseCase,
		@Inject(CheckFutureAppointmentsUseCase)
		private readonly checkFutureAppointmentsUseCase: CheckFutureAppointmentsUseCase,
		@Inject(APPOINTMENT_REPOSITORY_INTERFACE_KEY)
		private readonly appointmentsRepository: AppointmentsRepositoryInterface,
	) {}

	async execute(id: string): Promise<void> {
		const organizationService = await this.getExistingOrganizationServiceUseCase.execute({ where: { id } });

		const hasFutureAppointments = await this.appointmentsRepository.exists({
			where: {
				organization_service_id: organizationService.id,
				appointment_date: MoreThan(new Date()),
				status: Not(In([APPOINTMENT_STATUS.CANCELED, APPOINTMENT_STATUS.NO_SHOW])),
			},
		});

		this.checkFutureAppointmentsUseCase.execute(hasFutureAppointments);

		await this.organizationServicesRepository.delete({ id: organizationService.id });
	}
}
