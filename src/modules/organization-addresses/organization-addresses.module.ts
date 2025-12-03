import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OrganizationAddress } from './models/entities/organization-address.entity';
import { OrganizationAddressesRepository } from './repository/organization-addresses.repository';
import { ORGANIZATION_ADDRESS_REPOSITORY_INTERFACE_KEY } from './shared/constants/repository-interface-key';
import { CreateOrganizationAddressController } from './use-cases/create-organization-address/create-organization-address.controller';
import { CreateOrganizationAddressUseCase } from './use-cases/create-organization-address/create-organization-address.use-case';
import { DeleteOrganizationAddressController } from './use-cases/delete-organization-address/delete-organization-address.controller';
import { DeleteOrganizationAddressUseCase } from './use-cases/delete-organization-address/delete-organization-address.use-case';
import { GetExistingOrganizationAddressUseCase } from './use-cases/get-existing-organization-address/get-existing-organization-address.use-case';
import { GetOrganizationAddressController } from './use-cases/get-organization-address/get-organization-address.controller';
import { GetOrganizationAddressUseCase } from './use-cases/get-organization-address/get-organization-address.use-case';
import { ListOrganizationAddressesController } from './use-cases/list-organization-addresses/list-organization-addresses.controller';
import { ListOrganizationAddressesUseCase } from './use-cases/list-organization-addresses/list-organization-addresses.use-case';
import { UpdateOrganizationAddressController } from './use-cases/update-organization-address/update-organization-address.controller';
import { UpdateOrganizationAddressUseCase } from './use-cases/update-organization-address/update-organization-address.use-case';

@Module({
	imports: [TypeOrmModule.forFeature([OrganizationAddress])],
	controllers: [
		CreateOrganizationAddressController,
		GetOrganizationAddressController,
		UpdateOrganizationAddressController,
		DeleteOrganizationAddressController,
		ListOrganizationAddressesController,
	],
	providers: [
		{
			provide: ORGANIZATION_ADDRESS_REPOSITORY_INTERFACE_KEY,
			useFactory: (dataSource: DataSource) => {
				return new OrganizationAddressesRepository(dataSource);
			},
			inject: [DataSource],
		},
		GetExistingOrganizationAddressUseCase,
		CreateOrganizationAddressUseCase,
		GetOrganizationAddressUseCase,
		UpdateOrganizationAddressUseCase,
		DeleteOrganizationAddressUseCase,
		ListOrganizationAddressesUseCase,
	],
	exports: [ORGANIZATION_ADDRESS_REPOSITORY_INTERFACE_KEY, GetExistingOrganizationAddressUseCase],
})
export class OrganizationAddressesModule {}
