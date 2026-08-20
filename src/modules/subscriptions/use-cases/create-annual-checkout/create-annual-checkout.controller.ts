import { Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { Roles } from '@/modules/auth/shared/decorators/roles.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { OrganizationRole } from '@/shared/constants/organization-roles';
import { CreateAnnualCheckoutUseCase } from './create-annual-checkout.use-case';
import { CreateAnnualCheckoutDocs } from './docs';

@ApiTags('Subscriptions')
@ApiCookieAuth()
@Controller('organizations/subscription/annual-checkout')
export class CreateAnnualCheckoutController {
	constructor(
		@Inject(CreateAnnualCheckoutUseCase)
		private readonly createAnnualCheckoutUseCase: CreateAnnualCheckoutUseCase,
	) {}

	@TenantScoped()
	@Roles(OrganizationRole.OWNER)
	@Post()
	@HttpCode(HttpStatus.OK)
	@CreateAnnualCheckoutDocs()
	async execute(@ActiveOrganizationId() organizationId: string): Promise<{ checkoutUrl: string }> {
		return this.createAnnualCheckoutUseCase.execute(organizationId);
	}
}
