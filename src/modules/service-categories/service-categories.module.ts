import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OrganizationsModule } from '../organizations/organizations.module';
import { ServiceCategory } from './models/entities/service-category.entity';
import { ServiceCategoriesRepository } from './repository/service-categories.repository';
import { SERVICE_CATEGORY_REPOSITORY_INTERFACE_KEY } from './shared/constants/repository-interface-key';
import { CreateServiceCategoryController } from './use-cases/create-service-category/create-service-category.controller';
import { CreateServiceCategoryUseCase } from './use-cases/create-service-category/create-service-category.use-case';
import { DeleteServiceCategoryController } from './use-cases/delete-service-category/delete-service-category.controller';
import { DeleteServiceCategoryUseCase } from './use-cases/delete-service-category/delete-service-category.use-case';
import { GetExistingServiceCategoryUseCase } from './use-cases/get-existing-service-category/get-existing-service-category.use-case';
import { GetServiceCategoryController } from './use-cases/get-service-category/get-service-category.controller';
import { GetServiceCategoryUseCase } from './use-cases/get-service-category/get-service-category.use-case';
import { ListServiceCategoriesController } from './use-cases/list-service-categories/list-service-categories.controller';
import { ListServiceCategoriesUseCase } from './use-cases/list-service-categories/list-service-categories.use-case';
import { UpdateServiceCategoryController } from './use-cases/update-service-category/update-service-category.controller';
import { UpdateServiceCategoryUseCase } from './use-cases/update-service-category/update-service-category.use-case';

@Module({
	imports: [TypeOrmModule.forFeature([ServiceCategory]), forwardRef(() => OrganizationsModule)],
	controllers: [
		CreateServiceCategoryController,
		GetServiceCategoryController,
		UpdateServiceCategoryController,
		DeleteServiceCategoryController,
		ListServiceCategoriesController,
	],
	providers: [
		{
			provide: SERVICE_CATEGORY_REPOSITORY_INTERFACE_KEY,
			useFactory: (dataSource: DataSource) => {
				return new ServiceCategoriesRepository(dataSource);
			},
			inject: [DataSource],
		},
		GetExistingServiceCategoryUseCase,
		CreateServiceCategoryUseCase,
		GetServiceCategoryUseCase,
		UpdateServiceCategoryUseCase,
		DeleteServiceCategoryUseCase,
		ListServiceCategoriesUseCase,
	],
	exports: [SERVICE_CATEGORY_REPOSITORY_INTERFACE_KEY, GetExistingServiceCategoryUseCase],
})
export class ServiceCategoriesModule {}
