import { Inject, type CanActivate, type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MissingOrganizationContextException } from '../errors/missing-organization-context.error';
import { IS_PUBLIC_KEY } from '../shared/decorators/public.decorator';
import { IS_TENANT_SCOPED_KEY } from '../shared/decorators/tenant-scoped.decorator';

@Injectable()
export class TenantGuard implements CanActivate {
	constructor(@Inject(Reflector) private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
		if (isPublic) {
			return true;
		}

		const isTenantScoped = this.reflector.getAllAndOverride<boolean>(IS_TENANT_SCOPED_KEY, [context.getHandler(), context.getClass()]);
		if (!isTenantScoped) {
			return true;
		}

		const { user } = context.switchToHttp().getRequest();
		if (!user?.active_organization_id) {
			throw new MissingOrganizationContextException();
		}

		return true;
	}
}
