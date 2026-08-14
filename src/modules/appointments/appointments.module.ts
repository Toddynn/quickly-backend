import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CustomerModule } from '@/modules/customer/customer.module';
import { OrganizationMembersModule } from '@/modules/organization-members/organization-members.module';
import { OrganizationServicesModule } from '@/modules/organization-services/organization-services.module';
import { WorkingHoursModule } from '@/modules/working-hours/working-hours.module';
import { Appointment } from './models/entities/appointments.entity';
import { AppointmentsRepository } from './repository/appointments.repository';
import { APPOINTMENT_REPOSITORY_INTERFACE_KEY } from './shared/constants/repository-interface-key';
import { CancelAppointmentController } from './use-cases/transition-appointment-status/cancel-appointment.controller';
import { CompleteAppointmentController } from './use-cases/transition-appointment-status/complete-appointment.controller';
import { ConfirmAppointmentController } from './use-cases/transition-appointment-status/confirm-appointment.controller';
import { CreateAppointmentController } from './use-cases/create-appointment/create-appointment.controller';
import { CreateAppointmentUseCase } from './use-cases/create-appointment/create-appointment.use-case';
import { GetAppointmentController } from './use-cases/get-appointment/get-appointment.controller';
import { GetAppointmentUseCase } from './use-cases/get-appointment/get-appointment.use-case';
import { GetAvailableSlotsController } from './use-cases/get-available-slots/get-available-slots.controller';
import { GetAvailableSlotsUseCase } from './use-cases/get-available-slots/get-available-slots.use-case';
import { GetExistingAppointmentUseCase } from './use-cases/get-existing-appointment/get-existing-appointment.use-case';
import { ListAppointmentsController } from './use-cases/list-appointments/list-appointments.controller';
import { ListAppointmentsUseCase } from './use-cases/list-appointments/list-appointments.use-case';
import { MarkAppointmentNoShowController } from './use-cases/transition-appointment-status/mark-appointment-no-show.controller';
import { TransitionAppointmentStatusUseCase } from './use-cases/transition-appointment-status/transition-appointment-status.use-case';

@Module({
	imports: [
		TypeOrmModule.forFeature([Appointment]),
		WorkingHoursModule,
		forwardRef(() => OrganizationServicesModule),
		forwardRef(() => CustomerModule),
		forwardRef(() => OrganizationMembersModule),
	],
	// GetAvailableSlotsController (static "available-slots" path) precisa vir antes de
	// GetAppointmentController (":id") — Nest resolve rotas na ordem de registro dos controllers.
	controllers: [
		GetAvailableSlotsController,
		CreateAppointmentController,
		ListAppointmentsController,
		ConfirmAppointmentController,
		CompleteAppointmentController,
		CancelAppointmentController,
		MarkAppointmentNoShowController,
		GetAppointmentController,
	],
	providers: [
		{
			provide: APPOINTMENT_REPOSITORY_INTERFACE_KEY,
			useFactory: (dataSource: DataSource) => new AppointmentsRepository(dataSource),
			inject: [DataSource],
		},
		GetExistingAppointmentUseCase,
		GetAvailableSlotsUseCase,
		CreateAppointmentUseCase,
		ListAppointmentsUseCase,
		GetAppointmentUseCase,
		TransitionAppointmentStatusUseCase,
	],
	exports: [APPOINTMENT_REPOSITORY_INTERFACE_KEY, GetExistingAppointmentUseCase],
})
export class AppointmentsModule {}
