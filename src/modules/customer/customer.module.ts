import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OrganizationsModule } from '../organizations/organizations.module';
import { UsersModule } from '../users/users.module';
import { Customer } from './models/entities/customer.entity';
import { CustomersRepository } from './repository/customers.repository';
import { CUSTOMER_REPOSITORY_INTERFACE_KEY } from './shared/constants/repository-interface-key';
import { CreateCustomerController } from './use-cases/create-customer/create-customer.controller';
import { CreateCustomerUseCase } from './use-cases/create-customer/create-customer.use-case';
import { DeleteCustomerController } from './use-cases/delete-customer/delete-customer.controller';
import { DeleteCustomerUseCase } from './use-cases/delete-customer/delete-customer.use-case';
import { GetCustomerController } from './use-cases/get-customer/get-customer.controller';
import { GetCustomerUseCase } from './use-cases/get-customer/get-customer.use-case';
import { GetExistingCustomerUseCase } from './use-cases/get-existing-customer/get-existing-customer.use-case';
import { LinkCustomerToUserController } from './use-cases/link-customer-to-user/link-customer-to-user.controller';
import { LinkCustomerToUserUseCase } from './use-cases/link-customer-to-user/link-customer-to-user.use-case';
import { ListCustomersController } from './use-cases/list-customers/list-customers.controller';
import { ListCustomersUseCase } from './use-cases/list-customers/list-customers.use-case';
import { UpdateCustomerController } from './use-cases/update-customer/update-customer.controller';
import { UpdateCustomerUseCase } from './use-cases/update-customer/update-customer.use-case';

@Module({
	imports: [TypeOrmModule.forFeature([Customer]), forwardRef(() => OrganizationsModule), forwardRef(() => UsersModule)],
	controllers: [
		CreateCustomerController,
		GetCustomerController,
		UpdateCustomerController,
		DeleteCustomerController,
		ListCustomersController,
		LinkCustomerToUserController,
	],
	providers: [
		{
			provide: CUSTOMER_REPOSITORY_INTERFACE_KEY,
			useFactory: (dataSource: DataSource) => {
				return new CustomersRepository(dataSource);
			},
			inject: [DataSource],
		},
		GetExistingCustomerUseCase,
		CreateCustomerUseCase,
		GetCustomerUseCase,
		UpdateCustomerUseCase,
		DeleteCustomerUseCase,
		ListCustomersUseCase,
		LinkCustomerToUserUseCase,
	],
	exports: [CUSTOMER_REPOSITORY_INTERFACE_KEY, GetExistingCustomerUseCase, CreateCustomerUseCase],
})
export class CustomerModule {}
