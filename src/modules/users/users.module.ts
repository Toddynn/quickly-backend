import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EmailModule } from '../email/email.module';
import { PasswordReset } from './models/entities/password-reset.entity';
import { User } from './models/entities/user.entity';
import { PasswordResetRepository } from './repository/password-reset.repository';
import { UsersRepository } from './repository/users.repository';
import { PASSWORD_RESET_REPOSITORY_INTERFACE_KEY } from './shared/constants/password-reset-repository-interface-key';
import { USER_REPOSITORY_INTERFACE_KEY } from './shared/constants/repository-interface-key';
import { CreateUserController } from './use-cases/create-user/create-user.controller';
import { CreateUserUseCase } from './use-cases/create-user/create-user.use-case';
import { GetExistingPasswordResetUseCase } from './use-cases/get-existing-password-reset/get-existing-password-reset.use-case';
import { GetExistingUserUseCase } from './use-cases/get-existing-user/get-existing-user.use-case';
import { RequestPasswordResetController } from './use-cases/request-password-reset/request-password-reset.controller';
import { RequestPasswordResetUseCase } from './use-cases/request-password-reset/request-password-reset.use-case';
import { ResetPasswordController } from './use-cases/reset-password/reset-password.controller';
import { ResetPasswordUseCase } from './use-cases/reset-password/reset-password.use-case';
import { SendPasswordResetEmailUseCase } from './use-cases/send-password-reset-email/send-password-reset-email.use-case';
import { UpdateUserController } from './use-cases/update-user/update-user.controller';
import { UpdateUserUseCase } from './use-cases/update-user/update-user.use-case';
import { ValidatePasswordResetOtpController } from './use-cases/validate-password-reset-otp/validate-password-reset-otp.controller';
import { ValidatePasswordResetOtpUseCase } from './use-cases/validate-password-reset-otp/validate-password-reset-otp.use-case';

@Module({
	imports: [TypeOrmModule.forFeature([User, PasswordReset]), EmailModule],
	controllers: [CreateUserController, RequestPasswordResetController, ValidatePasswordResetOtpController, ResetPasswordController, UpdateUserController],
	providers: [
		{
			provide: USER_REPOSITORY_INTERFACE_KEY,
			useFactory: (dataSource: DataSource) => {
				return new UsersRepository(dataSource);
			},
			inject: [DataSource],
		},
		{
			provide: PASSWORD_RESET_REPOSITORY_INTERFACE_KEY,
			useFactory: (dataSource: DataSource) => {
				return new PasswordResetRepository(dataSource);
			},
			inject: [DataSource],
		},
		CreateUserUseCase,
		GetExistingUserUseCase,
		GetExistingPasswordResetUseCase,
		RequestPasswordResetUseCase,
		SendPasswordResetEmailUseCase,
		ValidatePasswordResetOtpUseCase,
		ResetPasswordUseCase,
		UpdateUserUseCase,
	],
	exports: [USER_REPOSITORY_INTERFACE_KEY, GetExistingUserUseCase],
})
export class UsersModule {}
