import type { Repository } from 'typeorm';
import type { OrganizationMember } from '../entities/organization-member.entity';

export interface OrganizationMembersRepositoryInterface extends Repository<OrganizationMember> {}
