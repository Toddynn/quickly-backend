import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OrganizationMembersModule } from '@/modules/organization-members/organization-members.module';
import { OrganizationWorkingHours } from './models/entities/organization-working-hours.entity';
import { ProfessionalScheduleException } from './models/entities/professional-schedule-exception.entity';
import { ProfessionalWorkingHours } from './models/entities/professional-working-hours.entity';
import { OrganizationWorkingHoursRepository } from './repository/organization-working-hours.repository';
import { ProfessionalScheduleExceptionRepository } from './repository/professional-schedule-exception.repository';
import { ProfessionalWorkingHoursRepository } from './repository/professional-working-hours.repository';
import {
	ORGANIZATION_WORKING_HOURS_REPOSITORY_KEY,
	PROFESSIONAL_SCHEDULE_EXCEPTION_REPOSITORY_KEY,
	PROFESSIONAL_WORKING_HOURS_REPOSITORY_KEY,
} from './shared/constants/repository-interface-key';
import { GetOrganizationWorkingHoursController } from './use-cases/get-organization-working-hours/get-organization-working-hours.controller';
import { GetOrganizationWorkingHoursUseCase } from './use-cases/get-organization-working-hours/get-organization-working-hours.use-case';
import { GetProfessionalWorkingHoursController } from './use-cases/get-professional-working-hours/get-professional-working-hours.controller';
import { GetProfessionalWorkingHoursUseCase } from './use-cases/get-professional-working-hours/get-professional-working-hours.use-case';
import { AssertOwnerOrSelfUseCase } from './use-cases/assert-owner-or-self/assert-owner-or-self.use-case';
import { CreateScheduleExceptionController } from './use-cases/create-schedule-exception/create-schedule-exception.controller';
import { CreateScheduleExceptionUseCase } from './use-cases/create-schedule-exception/create-schedule-exception.use-case';
import { DeleteScheduleExceptionController } from './use-cases/delete-schedule-exception/delete-schedule-exception.controller';
import { DeleteScheduleExceptionUseCase } from './use-cases/delete-schedule-exception/delete-schedule-exception.use-case';
import { GetProfessionalAvailabilityWindowUseCase } from './use-cases/get-professional-availability-window/get-professional-availability-window.use-case';
import { ListScheduleExceptionsController } from './use-cases/list-schedule-exceptions/list-schedule-exceptions.controller';
import { ListScheduleExceptionsUseCase } from './use-cases/list-schedule-exceptions/list-schedule-exceptions.use-case';
import { SetOrganizationWorkingHoursController } from './use-cases/set-organization-working-hours/set-organization-working-hours.controller';
import { SetOrganizationWorkingHoursUseCase } from './use-cases/set-organization-working-hours/set-organization-working-hours.use-case';
import { SetProfessionalWorkingHoursController } from './use-cases/set-professional-working-hours/set-professional-working-hours.controller';
import { SetProfessionalWorkingHoursUseCase } from './use-cases/set-professional-working-hours/set-professional-working-hours.use-case';

@Module({
	imports: [
		TypeOrmModule.forFeature([OrganizationWorkingHours, ProfessionalWorkingHours, ProfessionalScheduleException]),
		forwardRef(() => OrganizationMembersModule),
	],
	controllers: [
		SetOrganizationWorkingHoursController,
		GetOrganizationWorkingHoursController,
		SetProfessionalWorkingHoursController,
		GetProfessionalWorkingHoursController,
		CreateScheduleExceptionController,
		ListScheduleExceptionsController,
		DeleteScheduleExceptionController,
	],
	providers: [
		{
			provide: ORGANIZATION_WORKING_HOURS_REPOSITORY_KEY,
			useFactory: (dataSource: DataSource) => new OrganizationWorkingHoursRepository(dataSource),
			inject: [DataSource],
		},
		{
			provide: PROFESSIONAL_WORKING_HOURS_REPOSITORY_KEY,
			useFactory: (dataSource: DataSource) => new ProfessionalWorkingHoursRepository(dataSource),
			inject: [DataSource],
		},
		{
			provide: PROFESSIONAL_SCHEDULE_EXCEPTION_REPOSITORY_KEY,
			useFactory: (dataSource: DataSource) => new ProfessionalScheduleExceptionRepository(dataSource),
			inject: [DataSource],
		},
		SetOrganizationWorkingHoursUseCase,
		GetOrganizationWorkingHoursUseCase,
		AssertOwnerOrSelfUseCase,
		SetProfessionalWorkingHoursUseCase,
		GetProfessionalWorkingHoursUseCase,
		CreateScheduleExceptionUseCase,
		ListScheduleExceptionsUseCase,
		DeleteScheduleExceptionUseCase,
		GetProfessionalAvailabilityWindowUseCase,
	],
	exports: [
		ORGANIZATION_WORKING_HOURS_REPOSITORY_KEY,
		PROFESSIONAL_WORKING_HOURS_REPOSITORY_KEY,
		PROFESSIONAL_SCHEDULE_EXCEPTION_REPOSITORY_KEY,
		AssertOwnerOrSelfUseCase,
		GetProfessionalAvailabilityWindowUseCase,
	],
})
export class WorkingHoursModule {}
