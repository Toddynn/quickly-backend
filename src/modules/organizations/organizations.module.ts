import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OrganizationMembersModule } from '../organization-members/organization-members.module';
import { UsersModule } from '../users/users.module';
import { Organization } from './models/entities/organization.entity';
import { OrganizationsRepository } from './repository/organizations.repository';
import { ORGANIZATION_REPOSITORY_INTERFACE_KEY } from './shared/constants/repository-interface-key';
import { CreateOrganizationController } from './use-cases/create-organization/create-organization.controller';
import { CreateOrganizationUseCase } from './use-cases/create-organization/create-organization.use-case';
import { DeleteOrganizationController } from './use-cases/delete-organization/delete-organization.controller';
import { DeleteOrganizationUseCase } from './use-cases/delete-organization/delete-organization.use-case';
import { GetExistingOrganizationUseCase } from './use-cases/get-existing-organization/get-existing-organization.use-case';
import { GetOrganizationController } from './use-cases/get-organization/get-organization.controller';
import { GetOrganizationUseCase } from './use-cases/get-organization/get-organization.use-case';
import { ListOrganizationsController } from './use-cases/list-organizations/list-organizations.controller';
import { ListOrganizationsUseCase } from './use-cases/list-organizations/list-organizations.use-case';
import { UpdateOrganizationController } from './use-cases/update-organization/update-organization.controller';
import { UpdateOrganizationUseCase } from './use-cases/update-organization/update-organization.use-case';

@Module({
	imports: [TypeOrmModule.forFeature([Organization]), forwardRef(() => OrganizationMembersModule), forwardRef(() => UsersModule)],
	controllers: [
		CreateOrganizationController,
		GetOrganizationController,
		UpdateOrganizationController,
		DeleteOrganizationController,
		ListOrganizationsController,
	],
	providers: [
		{
			provide: ORGANIZATION_REPOSITORY_INTERFACE_KEY,
			useFactory: (dataSource: DataSource) => {
				return new OrganizationsRepository(dataSource);
			},
			inject: [DataSource],
		},
		GetExistingOrganizationUseCase,
		CreateOrganizationUseCase,
		GetOrganizationUseCase,
		UpdateOrganizationUseCase,
		DeleteOrganizationUseCase,
		ListOrganizationsUseCase,
	],
	exports: [ORGANIZATION_REPOSITORY_INTERFACE_KEY, GetExistingOrganizationUseCase],
})
export class OrganizationsModule {}
