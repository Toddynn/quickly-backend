import { Inject, Injectable } from '@nestjs/common';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListOrganizationAddressesDto } from '../../models/dto/list-organization-addresses.dto';
import type { OrganizationAddress } from '../../models/entities/organization-address.entity';
import type { OrganizationAddressesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_ADDRESS_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class ListOrganizationAddressesUseCase {
	constructor(
		@Inject(ORGANIZATION_ADDRESS_REPOSITORY_INTERFACE_KEY)
		private readonly organizationAddressesRepository: OrganizationAddressesRepositoryInterface,
	) {}

	async execute(listDto: ListOrganizationAddressesDto): Promise<PaginatedResponseDto<OrganizationAddress>> {
		const { page = 1, limit = 10, organization_id } = listDto;
		const skip = (page - 1) * limit;

		const where: Record<string, unknown> = {};

		if (organization_id) {
			where.organization_id = organization_id;
		}

		const [data, total] = await this.organizationAddressesRepository.findAndCount({
			where,
			relations: ['organization'],
			skip,
			take: limit,
		});

		const totalPages = Math.ceil(total / limit);

		return {
			data,
			page,
			limit,
			total,
			totalPages,
		};
	}
}
