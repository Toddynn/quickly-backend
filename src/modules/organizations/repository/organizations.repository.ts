import { Injectable } from '@nestjs/common';
import { type DataSource, Repository } from 'typeorm';
import type { PaginatedResponseDto, PaginationDto } from '@/shared/dto/pagination.dto';
import { Organization } from '../models/entities/organization.entity';
import type { OrganizationsRepositoryInterface } from '../models/interfaces/repository.interface';

@Injectable()
export class OrganizationsRepository extends Repository<Organization> implements OrganizationsRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(Organization, dataSource.createEntityManager());
	}

	async findAllPaginated(user_id: string, paginationDto: PaginationDto): Promise<PaginatedResponseDto<Organization>> {
		const { page = 1, limit = 10 } = paginationDto;
		const skip = (page - 1) * limit;

		const queryBuilder = this.createQueryBuilder('organization')
			.leftJoinAndSelect('organization.owner', 'owner')
			.loadRelationCountAndMap('organization.members_count', 'organization.organization_members')
			.where('organization.owner_id = :user_id', { user_id })
			.skip(skip)
			.take(limit);

		const [data, total] = await queryBuilder.getManyAndCount();

		const total_pages = Math.ceil(total / limit);

		return {
			data,
			page,
			limit,
			total,
			total_pages,
		};
	}
}
