import { Controller, Delete, Inject } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { Roles } from '@/modules/auth/shared/decorators/roles.decorator';
import { SkipSubscriptionGuard } from '@/modules/auth/shared/decorators/skip-subscription-guard.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { OrganizationRole } from '@/shared/constants/organization-roles';
import { Subscription } from '../../models/entities/subscription.entity';
import { CancelSubscriptionUseCase } from './cancel-subscription.use-case';
import { CancelSubscriptionDocs } from './docs';

@ApiTags('Subscriptions')
@ApiCookieAuth()
@Controller('organizations/subscription')
export class CancelSubscriptionController {
	constructor(
		@Inject(CancelSubscriptionUseCase)
		private readonly cancelSubscriptionUseCase: CancelSubscriptionUseCase,
	) {}

	@TenantScoped()
	@SkipSubscriptionGuard()
	@Roles(OrganizationRole.OWNER)
	@Delete()
	@CancelSubscriptionDocs()
	async execute(@ActiveOrganizationId() organizationId: string): Promise<Subscription> {
		return this.cancelSubscriptionUseCase.execute(organizationId);
	}
}
