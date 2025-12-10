import { Injectable } from '@nestjs/common';
import { type DataSource, type FindOptionsWhere, Repository } from 'typeorm';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListOrganizationMembersDto } from '../models/dto/input/list-organization-members.dto';
import type { ListOrganizationMemberResponseDto } from '../models/dto/output/list-organization-member-response.dto';
import { OrganizationMember } from '../models/entities/organization-member.entity';
import type { OrganizationMembersRepositoryInterface } from '../models/interfaces/repository.interface';

@Injectable()
export class OrganizationMembersRepository extends Repository<OrganizationMember> implements OrganizationMembersRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(OrganizationMember, dataSource.createEntityManager());
	}

	async findAllPaginated(listDto: ListOrganizationMembersDto): Promise<PaginatedResponseDto<ListOrganizationMemberResponseDto>> {
		const { page = 1, limit = 10, is_active } = listDto;
		const skip = (page - 1) * limit;

		const where: FindOptionsWhere<OrganizationMember> = {};

		if (is_active !== undefined) {
			where.active = is_active;
		}

		const [data, total] = await this.findAndCount({
			where,
			relations: ['organization', 'user'],
			skip,
			take: limit,
		});

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
