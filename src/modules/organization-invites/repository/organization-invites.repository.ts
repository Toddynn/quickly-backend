import { Injectable } from '@nestjs/common';
import { type DataSource, Repository } from 'typeorm';
import type { PaginatedResponseDto, PaginationDto } from '@/shared/dto/pagination.dto';
import type { ListOrganizationInviteResponseDto } from '../models/dto/output/list-organization-invite-response.dto';
import { OrganizationInvite } from '../models/entities/organization-invite.entity';
import type { OrganizationInvitesRepositoryInterface } from '../models/interfaces/repository.interface';

@Injectable()
export class OrganizationInvitesRepository extends Repository<OrganizationInvite> implements OrganizationInvitesRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(OrganizationInvite, dataSource.createEntityManager());
	}

	async findAllPaginated(paginationDto: PaginationDto): Promise<PaginatedResponseDto<ListOrganizationInviteResponseDto>> {
		const { page = 1, limit = 10 } = paginationDto;
		const skip = (page - 1) * limit;

		const [data, total] = await this.findAndCount({
			relations: ['organization', 'inviter'],
			skip,
			take: limit,
			order: {
				created_at: 'DESC',
			},
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
