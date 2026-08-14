import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { ProfessionalScheduleException } from '../../models/entities/professional-schedule-exception.entity';
import { ListScheduleExceptionsDocs } from './docs';
import { ListScheduleExceptionsUseCase } from './list-schedule-exceptions.use-case';

@ApiTags('Working Hours')
@ApiCookieAuth()
@TenantScoped()
@Controller('organization-members/:professionalId/schedule-exceptions')
export class ListScheduleExceptionsController {
	constructor(
		@Inject(ListScheduleExceptionsUseCase)
		private readonly listScheduleExceptionsUseCase: ListScheduleExceptionsUseCase,
	) {}

	@Get()
	@ListScheduleExceptionsDocs()
	async execute(@Param('professionalId') professionalId: string): Promise<ProfessionalScheduleException[]> {
		return this.listScheduleExceptionsUseCase.execute(professionalId);
	}
}
