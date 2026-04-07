import type { OrganizationMember } from '@/modules/organization-members/models/entities/organization-member.entity';
import type { TimestampedEntityInterface } from '@/shared/interfaces/timestamped-entity';

export interface User extends TimestampedEntityInterface {
	name: string;
	email: string;
	password: string;
	refresh_token_hash: string | null;
	organization_memberships: OrganizationMember[];
}
