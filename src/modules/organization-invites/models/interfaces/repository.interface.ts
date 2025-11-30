import type { Repository } from 'typeorm';
import type { OrganizationInvite } from '../entities/organization-invite.entity';

export interface OrganizationInvitesRepositoryInterface extends Repository<OrganizationInvite> {}
