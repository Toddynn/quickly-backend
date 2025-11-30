import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OrganizationsModule } from '../organizations/organizations.module';
import { ServiceCategoriesModule } from '../service-categories/service-categories.module';
import { OrganizationService } from './models/entities/organization-service.entity';
import { OrganizationServicesRepository } from './repository/organization-services.repository';
import { ORGANIZATION_SERVICE_REPOSITORY_INTERFACE_KEY } from './shared/constants/repository-interface-key';
import { ActivateOrganizationServiceController } from './use-cases/activate-organization-service/activate-organization-service.controller';
import { ActivateOrganizationServiceUseCase } from './use-cases/activate-organization-service/activate-organization-service.use-case';
import { CheckFutureAppointmentsUseCase } from './use-cases/check-future-appointments/check-future-appointments.use-case';
import { CreateOrganizationServiceController } from './use-cases/create-organization-service/create-organization-service.controller';
import { CreateOrganizationServiceUseCase } from './use-cases/create-organization-service/create-organization-service.use-case';
import { DeleteOrganizationServiceController } from './use-cases/delete-organization-service/delete-organization-service.controller';
import { DeleteOrganizationServiceUseCase } from './use-cases/delete-organization-service/delete-organization-service.use-case';
import { GetExistingOrganizationServiceUseCase } from './use-cases/get-existing-organization-service/get-existing-organization-service.use-case';
import { GetOrganizationServiceController } from './use-cases/get-organization-service/get-organization-service.controller';
import { GetOrganizationServiceUseCase } from './use-cases/get-organization-service/get-organization-service.use-case';
import { InactivateOrganizationServiceController } from './use-cases/inactivate-organization-service/inactivate-organization-service.controller';
import { InactivateOrganizationServiceUseCase } from './use-cases/inactivate-organization-service/inactivate-organization-service.use-case';
import { ListOrganizationServicesController } from './use-cases/list-organization-services/list-organization-services.controller';
import { ListOrganizationServicesUseCase } from './use-cases/list-organization-services/list-organization-services.use-case';
import { UpdateOrganizationServiceController } from './use-cases/update-organization-service/update-organization-service.controller';
import { UpdateOrganizationServiceUseCase } from './use-cases/update-organization-service/update-organization-service.use-case';
import { ValidateDurationUseCase } from './use-cases/validate-duration/validate-duration.use-case';

@Module({
	imports: [TypeOrmModule.forFeature([OrganizationService]), forwardRef(() => OrganizationsModule), forwardRef(() => ServiceCategoriesModule)],
	controllers: [
		CreateOrganizationServiceController,
		GetOrganizationServiceController,
		UpdateOrganizationServiceController,
		DeleteOrganizationServiceController,
		ListOrganizationServicesController,
		ActivateOrganizationServiceController,
		InactivateOrganizationServiceController,
	],
	providers: [
		{
			provide: ORGANIZATION_SERVICE_REPOSITORY_INTERFACE_KEY,
			useFactory: (dataSource: DataSource) => {
				return new OrganizationServicesRepository(dataSource);
			},
			inject: [DataSource],
		},
		GetExistingOrganizationServiceUseCase,
		CreateOrganizationServiceUseCase,
		GetOrganizationServiceUseCase,
		UpdateOrganizationServiceUseCase,
		DeleteOrganizationServiceUseCase,
		ListOrganizationServicesUseCase,
		ActivateOrganizationServiceUseCase,
		InactivateOrganizationServiceUseCase,
		ValidateDurationUseCase,
		CheckFutureAppointmentsUseCase,
	],
	exports: [ORGANIZATION_SERVICE_REPOSITORY_INTERFACE_KEY, GetExistingOrganizationServiceUseCase],
})
export class OrganizationServicesModule {}
