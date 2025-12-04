import { Inject, Injectable } from '@nestjs/common';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListOrganizationAddressesDto } from '../../models/dto/input/list-organization-addresses.dto';
import type { ListOrganizationAddressResponseDto } from '../../models/dto/output/list-organization-address-response.dto';
import type { OrganizationAddressesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_ADDRESS_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class ListOrganizationAddressesUseCase {
	constructor(
		@Inject(ORGANIZATION_ADDRESS_REPOSITORY_INTERFACE_KEY)
		private readonly organizationAddressesRepository: OrganizationAddressesRepositoryInterface,
	) {}

	async execute(listDto: ListOrganizationAddressesDto): Promise<PaginatedResponseDto<ListOrganizationAddressResponseDto>> {
		return this.organizationAddressesRepository.findAllPaginated(listDto);
	}
}
