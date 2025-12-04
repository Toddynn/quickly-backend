import type { Repository } from 'typeorm';
import type { PaginatedResponseDto, PaginationDto } from '@/shared/dto/pagination.dto';
import type { ListOrganizationInviteResponseDto } from '../dto/output/list-organization-invite-response.dto';
import type { OrganizationInvite } from '../entities/organization-invite.entity';

export interface OrganizationInvitesRepositoryInterface extends Repository<OrganizationInvite> {
	findAllPaginated(paginationDto: PaginationDto): Promise<PaginatedResponseDto<ListOrganizationInviteResponseDto>>;
}
