import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MediaModule } from '../media/media.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { User } from './models/entities/user.entity';
import { UsersRepository } from './repository/users.repository';
import { USER_REPOSITORY_INTERFACE_KEY } from './shared/constants/repository-interface-key';
import { CreateUserController } from './use-cases/create-user/create-user.controller';
import { CreateUserUseCase } from './use-cases/create-user/create-user.use-case';
import { GetExistingUserUseCase } from './use-cases/get-existing-user/get-existing-user.use-case';
import { GetExistingUserWithVerifiedEmailUseCase } from './use-cases/get-existing-user-with-verified-email/get-existing-user-with-verified-email.use-case';
import { DeleteProfilePictureController } from './use-cases/delete-profile-picture/delete-profile-picture.controller';
import { DeleteProfilePictureUseCase } from './use-cases/delete-profile-picture/delete-profile-picture.use-case';
import { GetCurrentUserController } from './use-cases/get-current-user/get-current-user.controller';
import { GetCurrentUserUseCase } from './use-cases/get-current-user/get-current-user.use-case';
import { UpdateProfilePictureController } from './use-cases/update-profile-picture/update-profile-picture.controller';
import { UpdateProfilePictureUseCase } from './use-cases/update-profile-picture/update-profile-picture.use-case';
import { UpdateUserController } from './use-cases/update-user/update-user.controller';
import { UpdateUserUseCase } from './use-cases/update-user/update-user.use-case';
import { UpdateUserPasswordUseCase } from './use-cases/update-user-password/update-user-password.use-case';

@Module({
	imports: [TypeOrmModule.forFeature([User]), MediaModule, forwardRef(() => OrganizationsModule)],
	controllers: [
		CreateUserController,
		UpdateUserController,
		UpdateProfilePictureController,
		DeleteProfilePictureController,
		GetCurrentUserController,
	],
	providers: [
		{
			provide: USER_REPOSITORY_INTERFACE_KEY,
			useFactory: (dataSource: DataSource) => {
				return new UsersRepository(dataSource);
			},
			inject: [DataSource],
		},
		CreateUserUseCase,
		GetExistingUserUseCase,
		GetExistingUserWithVerifiedEmailUseCase,
		UpdateUserUseCase,
		UpdateUserPasswordUseCase,
		UpdateProfilePictureUseCase,
		DeleteProfilePictureUseCase,
		GetCurrentUserUseCase,
	],
	exports: [USER_REPOSITORY_INTERFACE_KEY, GetExistingUserUseCase, GetExistingUserWithVerifiedEmailUseCase, UpdateUserPasswordUseCase, UpdateUserUseCase],
})
export class UsersModule {}
