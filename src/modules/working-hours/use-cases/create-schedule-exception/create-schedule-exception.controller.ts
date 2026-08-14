import { Body, Controller, Inject, Param, Post } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { SessionUser } from '@/modules/auth/models/interfaces/session-user.interface';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { CurrentUser } from '@/modules/auth/shared/decorators/current-user.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { CreateScheduleExceptionDto } from '../../models/dto/input/create-schedule-exception.dto';
import { ProfessionalScheduleException } from '../../models/entities/professional-schedule-exception.entity';
import { CreateScheduleExceptionDocs } from './docs';
import { CreateScheduleExceptionUseCase } from './create-schedule-exception.use-case';

@ApiTags('Working Hours')
@ApiCookieAuth()
@TenantScoped()
@Controller('organization-members/:professionalId/schedule-exceptions')
export class CreateScheduleExceptionController {
	constructor(
		@Inject(CreateScheduleExceptionUseCase)
		private readonly createScheduleExceptionUseCase: CreateScheduleExceptionUseCase,
	) {}

	@Post()
	@CreateScheduleExceptionDocs()
	async execute(
		@Param('professionalId') professionalId: string,
		@ActiveOrganizationId() organizationId: string,
		@Body() dto: CreateScheduleExceptionDto,
		@CurrentUser() currentUser: SessionUser,
	): Promise<ProfessionalScheduleException> {
		return this.createScheduleExceptionUseCase.execute(professionalId, organizationId, dto, currentUser);
	}
}
