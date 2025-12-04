import type { Repository } from 'typeorm';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { OrganizationService } from '../entities/organization-service.entity';
import type { ListOrganizationServicesDto } from '../dto/input/list-organization-services.dto';
import type { ListOrganizationServiceResponseDto } from '../dto/output/list-organization-service-response.dto';

export interface OrganizationServicesRepositoryInterface extends Repository<OrganizationService> {
	findAllPaginated(listDto: ListOrganizationServicesDto): Promise<PaginatedResponseDto<ListOrganizationServiceResponseDto>>;
}
