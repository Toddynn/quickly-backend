import { Inject, Injectable } from '@nestjs/common';
import type { UpdateResult } from 'typeorm';
import type { OrganizationServicesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_SERVICE_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { GetExistingOrganizationServiceUseCase } from '../get-existing-organization-service/get-existing-organization-service.use-case';

@Injectable()
export class InactivateOrganizationServiceUseCase {
	constructor(
		@Inject(ORGANIZATION_SERVICE_REPOSITORY_INTERFACE_KEY)
		private readonly organizationServicesRepository: OrganizationServicesRepositoryInterface,
		@Inject(GetExistingOrganizationServiceUseCase)
		private readonly getExistingOrganizationServiceUseCase: GetExistingOrganizationServiceUseCase,
	) {}

	async execute(id: string): Promise<UpdateResult> {
		await this.getExistingOrganizationServiceUseCase.execute({ where: { id } });
		return await this.organizationServicesRepository.update(id, { active: false });
	}
}
