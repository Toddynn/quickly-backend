import type { Repository } from 'typeorm';
import type { PaginatedResponseDto, PaginationDto } from '@/shared/dto/pagination.dto';
import type { Organization } from '../entities/organization.entity';

export interface OrganizationsRepositoryInterface extends Repository<Organization> {
	findAllPaginated(user_id: string, paginationDto: PaginationDto): Promise<PaginatedResponseDto<Organization>>;
}
