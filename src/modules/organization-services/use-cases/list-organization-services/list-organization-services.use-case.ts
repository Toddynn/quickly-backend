import { Inject, Injectable } from '@nestjs/common';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListOrganizationServicesDto } from '../../models/dto/input/list-organization-services.dto';
import type { ListOrganizationServiceResponseDto } from '../../models/dto/output/list-organization-service-response.dto';
import type { OrganizationServicesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_SERVICE_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class ListOrganizationServicesUseCase {
	constructor(
		@Inject(ORGANIZATION_SERVICE_REPOSITORY_INTERFACE_KEY)
		private readonly organizationServicesRepository: OrganizationServicesRepositoryInterface,
	) {}

	async execute(listDto: ListOrganizationServicesDto): Promise<PaginatedResponseDto<ListOrganizationServiceResponseDto>> {
		return this.organizationServicesRepository.findAllPaginated(listDto);
	}
}
