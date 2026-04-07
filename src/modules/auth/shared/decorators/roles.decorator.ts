import { SetMetadata } from '@nestjs/common';
import type { OrganizationRole } from '@/shared/constants/organization-roles';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: OrganizationRole[]) => SetMetadata(ROLES_KEY, roles);
