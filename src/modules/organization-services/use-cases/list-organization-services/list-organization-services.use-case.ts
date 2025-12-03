import { Inject, Injectable } from '@nestjs/common';
import { type FindOptionsWhere, ILike } from 'typeorm';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListOrganizationServicesDto } from '../../models/dto/input/list-organization-services.dto';
import type { ListOrganizationServiceResponseDto } from '../../models/dto/output/list-organization-service-response.dto';
import type { OrganizationService } from '../../models/entities/organization-service.entity';
import type { OrganizationServicesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_SERVICE_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class ListOrganizationServicesUseCase {
	constructor(
		@Inject(ORGANIZATION_SERVICE_REPOSITORY_INTERFACE_KEY)
		private readonly organizationServicesRepository: OrganizationServicesRepositoryInterface,
	) {}

	async execute(listDto: ListOrganizationServicesDto): Promise<PaginatedResponseDto<ListOrganizationServiceResponseDto>> {
		const { page = 1, limit = 10, organization_id, service_category_id, search, active } = listDto;
		const skip = (page - 1) * limit;

		const where: FindOptionsWhere<OrganizationService> = {};

		if (organization_id) {
			where.organization_id = organization_id;
		}
		if (service_category_id) {
			where.service_category_id = service_category_id;
		}
		if (search) {
			where.name = ILike(`%${search}%`);
		}

		if (active !== undefined) {
			where.active = active;
		}

		const [data, total] = await this.organizationServicesRepository.findAndCount({
			where,
			relations: ['organization', 'serviceCategory'],
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
