import { Injectable } from '@nestjs/common';
import { type DataSource, type FindOptionsWhere, Repository } from 'typeorm';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListOrganizationAddressesDto } from '../models/dto/input/list-organization-addresses.dto';
import type { ListOrganizationAddressResponseDto } from '../models/dto/output/list-organization-address-response.dto';
import { OrganizationAddress } from '../models/entities/organization-address.entity';
import type { OrganizationAddressesRepositoryInterface } from '../models/interfaces/repository.interface';

@Injectable()
export class OrganizationAddressesRepository extends Repository<OrganizationAddress> implements OrganizationAddressesRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(OrganizationAddress, dataSource.createEntityManager());
	}

	async findAllPaginated(listDto: ListOrganizationAddressesDto): Promise<PaginatedResponseDto<ListOrganizationAddressResponseDto>> {
		const { page = 1, limit = 10, organization_id } = listDto;
		const skip = (page - 1) * limit;

		const where: FindOptionsWhere<OrganizationAddress> = {};

		if (organization_id) {
			where.organization_id = organization_id;
		}

		const [data, total] = await this.findAndCount({
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
