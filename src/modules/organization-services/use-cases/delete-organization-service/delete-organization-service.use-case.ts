import { Inject, Injectable } from '@nestjs/common';
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
	) {}

	async execute(id: string): Promise<void> {
		const organizationService = await this.getExistingOrganizationServiceUseCase.execute({ where: { id } });

		// TODO: Implementar verificação de agendamentos futuros quando o módulo de agendamentos estiver disponível
		// Por enquanto, assumimos que não há agendamentos futuros
		const hasFutureAppointments = false;

		this.checkFutureAppointmentsUseCase.execute(hasFutureAppointments);

		await this.organizationServicesRepository.delete({ id: organizationService.id });
	}
}
