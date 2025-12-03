import { Inject, Injectable } from '@nestjs/common';
import type { OrganizationAddressesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_ADDRESS_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { GetExistingOrganizationAddressUseCase } from '../get-existing-organization-address/get-existing-organization-address.use-case';

@Injectable()
export class DeleteOrganizationAddressUseCase {
	constructor(
		@Inject(ORGANIZATION_ADDRESS_REPOSITORY_INTERFACE_KEY)
		private readonly organizationAddressesRepository: OrganizationAddressesRepositoryInterface,
		@Inject(GetExistingOrganizationAddressUseCase)
		private readonly getExistingOrganizationAddressUseCase: GetExistingOrganizationAddressUseCase,
	) {}

	async execute(id: string): Promise<void> {
		const organizationAddress = await this.getExistingOrganizationAddressUseCase.execute({ where: { id } });
		await this.organizationAddressesRepository.delete({ id: organizationAddress.id });
	}
}
