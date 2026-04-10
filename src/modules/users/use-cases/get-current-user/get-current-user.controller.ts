import { Controller, Get, Inject } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import type { SessionUser } from '@/modules/auth/models/interfaces/session-user.interface';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { CurrentUser } from '@/modules/auth/shared/decorators/current-user.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { GetCurrentUserDocs } from './docs';
import { type UserWithActiveTenantContext, GetCurrentUserUseCase } from './get-current-user.use-case';

@ApiTags('Users')
@ApiCookieAuth()
@TenantScoped()
@Controller('users')
export class GetCurrentUserController {
	constructor(
		@Inject(GetCurrentUserUseCase)
		private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
	) {}

	@Get('me')
	@GetCurrentUserDocs()
	async execute(
		@CurrentUser() sessionUser: SessionUser,
		@ActiveOrganizationId() organizationId: string,
	): Promise<UserWithActiveTenantContext> {
		return await this.getCurrentUserUseCase.execute({
			user_id: sessionUser.userId,
			organization_id: organizationId,
		});
	}
}
