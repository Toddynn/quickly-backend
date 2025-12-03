import { Inject, Injectable } from '@nestjs/common';
import type { UpdateResult } from 'typeorm';
import type { UpdateOrganizationAddressDto } from '../../models/dto/input/update-organization-address.dto';
import type { OrganizationAddressesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_ADDRESS_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { GetExistingOrganizationAddressUseCase } from '../get-existing-organization-address/get-existing-organization-address.use-case';

@Injectable()
export class UpdateOrganizationAddressUseCase {
	constructor(
		@Inject(ORGANIZATION_ADDRESS_REPOSITORY_INTERFACE_KEY)
		private readonly organizationAddressesRepository: OrganizationAddressesRepositoryInterface,
		@Inject(GetExistingOrganizationAddressUseCase)
		private readonly getExistingOrganizationAddressUseCase: GetExistingOrganizationAddressUseCase,
	) {}

	async execute(id: string, updateOrganizationAddressDto: UpdateOrganizationAddressDto): Promise<UpdateResult> {
		const organizationAddress = await this.getExistingOrganizationAddressUseCase.execute({ where: { id } });

		return await this.organizationAddressesRepository.update(organizationAddress.id, updateOrganizationAddressDto);
	}
}
