import { Controller, Get, Inject } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { SkipSubscriptionGuard } from '@/modules/auth/shared/decorators/skip-subscription-guard.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { Subscription } from '../../models/entities/subscription.entity';
import { GetOrganizationSubscriptionDocs } from './docs';
import { GetOrganizationSubscriptionUseCase } from './get-organization-subscription.use-case';

@ApiTags('Subscriptions')
@ApiCookieAuth()
@Controller('organizations/subscription')
export class GetOrganizationSubscriptionController {
	constructor(
		@Inject(GetOrganizationSubscriptionUseCase)
		private readonly getOrganizationSubscriptionUseCase: GetOrganizationSubscriptionUseCase,
	) {}

	@TenantScoped()
	@SkipSubscriptionGuard()
	@Get()
	@GetOrganizationSubscriptionDocs()
	async execute(@ActiveOrganizationId() organizationId: string): Promise<Subscription> {
		return this.getOrganizationSubscriptionUseCase.execute(organizationId);
	}
}
