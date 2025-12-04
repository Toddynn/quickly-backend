import type { Repository } from 'typeorm';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListOrganizationMembersDto } from '../dto/input/list-organization-members.dto';
import type { ListOrganizationMemberResponseDto } from '../dto/output/list-organization-member-response.dto';
import type { OrganizationMember } from '../entities/organization-member.entity';

export interface OrganizationMembersRepositoryInterface extends Repository<OrganizationMember> {
	findAllPaginated(listDto: ListOrganizationMembersDto): Promise<PaginatedResponseDto<ListOrganizationMemberResponseDto>>;
}
