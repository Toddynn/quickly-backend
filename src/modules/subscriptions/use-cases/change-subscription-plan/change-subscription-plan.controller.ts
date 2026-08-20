import { Body, Controller, Inject, Patch } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { Roles } from '@/modules/auth/shared/decorators/roles.decorator';
import { SkipSubscriptionGuard } from '@/modules/auth/shared/decorators/skip-subscription-guard.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { OrganizationRole } from '@/shared/constants/organization-roles';
import { ChangePlanDto } from '../../models/dto/input/change-plan.dto';
import { Subscription } from '../../models/entities/subscription.entity';
import { ChangeSubscriptionPlanUseCase } from './change-subscription-plan.use-case';
import { ChangeSubscriptionPlanDocs } from './docs';

@ApiTags('Subscriptions')
@ApiCookieAuth()
@Controller('organizations/subscription/plan')
export class ChangeSubscriptionPlanController {
	constructor(
		@Inject(ChangeSubscriptionPlanUseCase)
		private readonly changeSubscriptionPlanUseCase: ChangeSubscriptionPlanUseCase,
	) {}

	@TenantScoped()
	@SkipSubscriptionGuard()
	@Roles(OrganizationRole.OWNER)
	@Patch()
	@ChangeSubscriptionPlanDocs()
	async execute(@ActiveOrganizationId() organizationId: string, @Body() changePlanDto: ChangePlanDto): Promise<Subscription> {
		return this.changeSubscriptionPlanUseCase.execute(organizationId, changePlanDto.plan_id);
	}
}
