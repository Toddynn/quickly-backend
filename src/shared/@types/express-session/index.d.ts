import 'express-session';
import type { OrganizationRole } from '@/shared/constants/organization-roles';

declare module 'express-session' {
     interface SessionData {
          userId: string;
          email: string;
          activeOrganizationId: string | null;
          organizationRole: OrganizationRole | null;
          rememberMe?: boolean;
          sessionStartedAt?: number;
     }
}
