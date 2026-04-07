import type { OrganizationRole } from '@/shared/constants/organization-roles';

export interface SessionUser {
	userId: string;
	email: string;
	activeOrganizationId: string | null;
	organizationRole: OrganizationRole | null;
}
