import { Injectable } from '@nestjs/common';
import { type DataSource, Repository } from 'typeorm';
import type { PaginatedResponseDto, PaginationDto } from '@/shared/dto/pagination.dto';
import type { ListOrganizationResponseDto } from '../models/dto/output/list-organization-response.dto';
import { Organization } from '../models/entities/organization.entity';
import type { OrganizationsRepositoryInterface } from '../models/interfaces/repository.interface';

@Injectable()
export class OrganizationsRepository extends Repository<Organization> implements OrganizationsRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(Organization, dataSource.createEntityManager());
	}

	async findAllPaginated(paginationDto: PaginationDto): Promise<PaginatedResponseDto<ListOrganizationResponseDto>> {
		const { page = 1, limit = 10 } = paginationDto;
		const skip = (page - 1) * limit;

		const queryBuilder = this.createQueryBuilder('organization')
			.leftJoinAndSelect('organization.owner', 'owner')
			.loadRelationCountAndMap('organization.members_count', 'organization.organization_members')
			.skip(skip)
			.take(limit);

		const [data, total] = await queryBuilder.getManyAndCount();

		const totalPages = Math.ceil(total / limit);

		return {
			data: data as unknown as ListOrganizationResponseDto[],
			page,
			limit,
			total,
			totalPages,
		};
	}
}
