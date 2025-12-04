import type { Repository } from 'typeorm';
import type { PaginatedResponseDto, PaginationDto } from '@/shared/dto/pagination.dto';
import type { ListOrganizationResponseDto } from '../dto/output/list-organization-response.dto';
import type { Organization } from '../entities/organization.entity';

export interface OrganizationsRepositoryInterface extends Repository<Organization> {
	findAllPaginated(paginationDto: PaginationDto): Promise<PaginatedResponseDto<ListOrganizationResponseDto>>;
}
