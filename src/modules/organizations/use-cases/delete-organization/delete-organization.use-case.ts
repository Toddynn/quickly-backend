import { Inject, Injectable } from '@nestjs/common';
import type { OrganizationsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { GetExistingOrganizationUseCase } from '../get-existing-organization/get-existing-organization.use-case';

@Injectable()
export class DeleteOrganizationUseCase {
	constructor(
		@Inject(ORGANIZATION_REPOSITORY_INTERFACE_KEY)
		private readonly organizationsRepository: OrganizationsRepositoryInterface,
		@Inject(GetExistingOrganizationUseCase)
		private readonly getExistingOrganizationUseCase: GetExistingOrganizationUseCase,
	) {}

	async execute(id: string): Promise<void> {
		const organization = await this.getExistingOrganizationUseCase.execute({ where: { id } });
		await this.organizationsRepository.delete({ id: organization.id });
	}
}
