import { Inject, Injectable } from '@nestjs/common';
import type { CreateOrganizationAddressDto } from '../../models/dto/create-organization-address.dto';
import type { OrganizationAddress } from '../../models/entities/organization-address.entity';
import type { OrganizationAddressesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_ADDRESS_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class CreateOrganizationAddressUseCase {
	constructor(
		@Inject(ORGANIZATION_ADDRESS_REPOSITORY_INTERFACE_KEY)
		private readonly organizationAddressesRepository: OrganizationAddressesRepositoryInterface,
	) {}

	async execute(createOrganizationAddressDto: CreateOrganizationAddressDto): Promise<OrganizationAddress> {
		const organizationAddress = this.organizationAddressesRepository.create(createOrganizationAddressDto);
		await this.organizationAddressesRepository.save(organizationAddress);

		return organizationAddress;
	}
}
