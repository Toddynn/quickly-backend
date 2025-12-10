import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { EmailModule } from '../email/email.module';
import { UsersModule } from '../users/users.module';
import { PasswordReset } from './models/entities/password-reset.entity';
import { PasswordResetRepository } from './repository/password-reset.repository';
import { PASSWORD_RESET_REPOSITORY_INTERFACE_KEY } from './shared/constants/password-reset-repository-interface-key';
import { CheckPasswordResetAttemptsUseCase } from './use-cases/check-password-reset-attempts/check-password-reset-attempts.use-case';
import { GetExistingPasswordResetUseCase } from './use-cases/get-existing-password-reset/get-existing-password-reset.use-case';
import { MarkPasswordResetAsUsedUseCase } from './use-cases/mark-password-reset-as-used/mark-password-reset-as-used.use-case';
import { RequestPasswordResetController } from './use-cases/request-password-reset/request-password-reset.controller';
import { RequestPasswordResetUseCase } from './use-cases/request-password-reset/request-password-reset.use-case';
import { ResetPasswordController } from './use-cases/reset-password/reset-password.controller';
import { ResetPasswordUseCase } from './use-cases/reset-password/reset-password.use-case';
import { SendPasswordResetEmailUseCase } from './use-cases/send-password-reset-email/send-password-reset-email.use-case';
import { UpdatePasswordResetUseCase } from './use-cases/update-password-reset/update-password-reset.use-case';
import { ValidatePasswordResetExpirationUseCase } from './use-cases/validate-password-reset-expiration/validate-password-reset-expiration.use-case';
import { ValidatePasswordResetOtpController } from './use-cases/validate-password-reset-otp/validate-password-reset-otp.controller';
import { ValidatePasswordResetOtpUseCase } from './use-cases/validate-password-reset-otp/validate-password-reset-otp.use-case';

@Module({
	imports: [TypeOrmModule.forFeature([PasswordReset]), EmailModule, UsersModule],
	controllers: [RequestPasswordResetController, ValidatePasswordResetOtpController, ResetPasswordController],
	providers: [
		{
			provide: PASSWORD_RESET_REPOSITORY_INTERFACE_KEY,
			useFactory: (dataSource: DataSource) => {
				return new PasswordResetRepository(dataSource);
			},
			inject: [DataSource],
		},
		GetExistingPasswordResetUseCase,
		CheckPasswordResetAttemptsUseCase,
		UpdatePasswordResetUseCase,
		RequestPasswordResetUseCase,
		SendPasswordResetEmailUseCase,
		ValidatePasswordResetOtpUseCase,
		ValidatePasswordResetExpirationUseCase,
		MarkPasswordResetAsUsedUseCase,
		ResetPasswordUseCase,
	],
	exports: [PASSWORD_RESET_REPOSITORY_INTERFACE_KEY, GetExistingPasswordResetUseCase],
})
export class PasswordResetModule {}
