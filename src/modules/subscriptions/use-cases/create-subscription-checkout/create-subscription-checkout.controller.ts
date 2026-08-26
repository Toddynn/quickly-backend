import { Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { Roles } from '@/modules/auth/shared/decorators/roles.decorator';
import { SkipSubscriptionGuard } from '@/modules/auth/shared/decorators/skip-subscription-guard.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { OrganizationRole } from '@/shared/constants/organization-roles';
import { CreateSubscriptionCheckoutUseCase } from './create-subscription-checkout.use-case';
import { CreateSubscriptionCheckoutDocs } from './docs';

@ApiTags('Subscriptions')
@ApiCookieAuth()
@Controller('organizations/subscription/checkout')
export class CreateSubscriptionCheckoutController {
	constructor(
		@Inject(CreateSubscriptionCheckoutUseCase)
		private readonly createSubscriptionCheckoutUseCase: CreateSubscriptionCheckoutUseCase,
	) {}

	@TenantScoped()
	@SkipSubscriptionGuard()
	@Roles(OrganizationRole.OWNER)
	@Post()
	@HttpCode(HttpStatus.OK)
	@CreateSubscriptionCheckoutDocs()
	async execute(@ActiveOrganizationId() organizationId: string): Promise<{ checkoutUrl: string }> {
		return this.createSubscriptionCheckoutUseCase.execute(organizationId);
	}
}
