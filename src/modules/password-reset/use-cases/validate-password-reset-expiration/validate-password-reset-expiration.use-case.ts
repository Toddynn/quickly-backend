import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type { PasswordReset } from '../../models/entities/password-reset.entity';
import { PASSWORD_RESET_STATUS } from '../../shared/interfaces/password-reset-status';

@Injectable()
export class ValidatePasswordResetExpirationUseCase {
	constructor(
		@Inject(DataSource)
		private readonly dataSource: DataSource,
	) {}

	async execute(passwordReset: PasswordReset): Promise<void> {
		// Verifica se o OTP expirou
		const expirationDate = new Date(passwordReset.expiration_date);
		if (expirationDate < new Date()) {
			const queryRunner = this.dataSource.createQueryRunner();
			await queryRunner.connect();
			await queryRunner.startTransaction();

			try {
				await queryRunner.manager.update('password_resets', passwordReset.id, {
					status: PASSWORD_RESET_STATUS.EXPIRED,
				});

				await queryRunner.commitTransaction();
			} catch (error) {
				await queryRunner.rollbackTransaction();
				throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
			} finally {
				await queryRunner.release();
			}

			throw new BadRequestException('Código OTP expirado.');
		}
	}
}
