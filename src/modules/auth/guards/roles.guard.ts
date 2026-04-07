import { Inject, type CanActivate, type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { OrganizationRole } from '@/shared/constants/organization-roles';
import { ROLES_KEY } from '../shared/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(@Inject(Reflector) private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<OrganizationRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

		if (!requiredRoles?.length) {
			return true;
		}

		const { user } = context.switchToHttp().getRequest();
		if (!user?.organization_role) {
			return false;
		}

		return requiredRoles.includes(user.organization_role);
	}
}
