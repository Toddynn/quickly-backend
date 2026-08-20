import { type CanActivate, type ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SubscriptionStatus } from '@/modules/subscriptions/shared/enums/subscription-status.enum';
import { GetExistingSubscriptionUseCase } from '@/modules/subscriptions/use-cases/get-existing-subscription/get-existing-subscription.use-case';
import { IS_PUBLIC_KEY } from '../shared/decorators/public.decorator';
import { IS_SUBSCRIPTION_GUARD_SKIPPED_KEY } from '../shared/decorators/skip-subscription-guard.decorator';
import { IS_TENANT_SCOPED_KEY } from '../shared/decorators/tenant-scoped.decorator';

const ALLOWED_STATUSES = [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING];

@Injectable()
export class SubscriptionStatusGuard implements CanActivate {
	constructor(
		@Inject(Reflector) private readonly reflector: Reflector,
		@Inject(GetExistingSubscriptionUseCase) private readonly getExistingSubscriptionUseCase: GetExistingSubscriptionUseCase,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
		if (isPublic) return true;

		const isTenantScoped = this.reflector.getAllAndOverride<boolean>(IS_TENANT_SCOPED_KEY, [context.getHandler(), context.getClass()]);
		if (!isTenantScoped) return true;

		const isSkipped = this.reflector.getAllAndOverride<boolean>(IS_SUBSCRIPTION_GUARD_SKIPPED_KEY, [context.getHandler(), context.getClass()]);
		if (isSkipped) return true;

		const { session } = context.switchToHttp().getRequest();
		const organizationId = session?.activeOrganizationId;
		if (!organizationId) return true; // TenantGuard já cobre a ausência de contexto de organização

		const subscription = await this.getExistingSubscriptionUseCase.execute({ where: { organization_id: organizationId } });
		if (!subscription) return true; // fail-open — mesma filosofia do EnforcePlanLimitUseCase

		if (!ALLOWED_STATUSES.includes(subscription.status)) {
			throw new ForbiddenException({
				message: 'Assinatura inativa. Regularize o pagamento para continuar.',
				status: subscription.status,
			});
		}

		return true;
	}
}
