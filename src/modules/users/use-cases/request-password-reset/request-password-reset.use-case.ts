import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type { RequestPasswordResetDto } from '../../models/dto/request-password-reset.dto';
import { PasswordReset } from '../../models/entities/password-reset.entity';
import { PASSWORD_RESET_STATUS } from '../../shared/constants/password-reset-status';
import { GetExistingPasswordResetUseCase } from '../get-existing-password-reset/get-existing-password-reset.use-case';
import { GetExistingUserUseCase } from '../get-existing-user/get-existing-user.use-case';
import { SendPasswordResetEmailUseCase } from '../send-password-reset-email/send-password-reset-email.use-case';

@Injectable()
export class RequestPasswordResetUseCase {
	constructor(
		@Inject(DataSource)
		private readonly dataSource: DataSource,
		@Inject(GetExistingUserUseCase)
		private readonly getExistingUserUseCase: GetExistingUserUseCase,
		@Inject(GetExistingPasswordResetUseCase)
		private readonly getExistingPasswordResetUseCase: GetExistingPasswordResetUseCase,
		@Inject(SendPasswordResetEmailUseCase)
		private readonly sendPasswordResetEmailUseCase: SendPasswordResetEmailUseCase,
	) {}

	async execute(requestPasswordResetDto: RequestPasswordResetDto): Promise<void> {
		const user = await this.getExistingUserUseCase.execute(
			{
				where: { email: requestPasswordResetDto.email },
			},
			{ throwIfNotFound: false, throwIfFound: false },
		);

		if (!user) return;

		// Invalida qualquer OTP pendente anterior para este usuário
		const existingPasswordReset = await this.getExistingPasswordResetUseCase.execute(
			{
				where: {
					user_id: user.id,
					status: PASSWORD_RESET_STATUS.PENDING,
				},
			},
			{ throwIfNotFound: false },
		);

		if (existingPasswordReset) {
			await this.dataSource.getRepository(PasswordReset).update(existingPasswordReset.id, {
				status: PASSWORD_RESET_STATUS.EXPIRED,
			});
		}

		// Gera código OTP de 6 dígitos
		const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

		const expirationDate = new Date();
		expirationDate.setMinutes(expirationDate.getMinutes() + 15); // OTP expira em 15 minutos

		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const passwordReset = queryRunner.manager.create(PasswordReset, {
				user_id: user.id,
				otp_code: otpCode,
				expiration_date: expirationDate,
				status: PASSWORD_RESET_STATUS.PENDING,
				validated: false,
			});

			await queryRunner.manager.save(passwordReset);

			await this.sendPasswordResetEmailUseCase.execute({
				email: requestPasswordResetDto.email,
				otpCode: passwordReset.otp_code,
			});

			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		} finally {
			await queryRunner.release();
		}
	}
}
