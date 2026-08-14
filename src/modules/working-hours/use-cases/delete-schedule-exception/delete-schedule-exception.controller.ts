import { Controller, Delete, Inject, Param } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { SessionUser } from '@/modules/auth/models/interfaces/session-user.interface';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { CurrentUser } from '@/modules/auth/shared/decorators/current-user.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { DeleteScheduleExceptionDocs } from './docs';
import { DeleteScheduleExceptionUseCase } from './delete-schedule-exception.use-case';

@ApiTags('Working Hours')
@ApiCookieAuth()
@TenantScoped()
@Controller('schedule-exceptions')
export class DeleteScheduleExceptionController {
	constructor(
		@Inject(DeleteScheduleExceptionUseCase)
		private readonly deleteScheduleExceptionUseCase: DeleteScheduleExceptionUseCase,
	) {}

	@Delete(':id')
	@DeleteScheduleExceptionDocs()
	async execute(
		@Param('id') id: string,
		@ActiveOrganizationId() organizationId: string,
		@CurrentUser() currentUser: SessionUser,
	): Promise<void> {
		return this.deleteScheduleExceptionUseCase.execute(id, organizationId, currentUser);
	}
}
