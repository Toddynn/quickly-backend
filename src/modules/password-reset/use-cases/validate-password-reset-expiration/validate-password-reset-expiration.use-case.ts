import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { PasswordReset } from '../../models/entities/password-reset.entity';
import { PASSWORD_RESET_STATUS } from '../../shared/interfaces/password-reset-status';
import { UpdatePasswordResetUseCase } from '../update-password-reset/update-password-reset.use-case';

@Injectable()
export class ValidatePasswordResetExpirationUseCase {
	constructor(
		@Inject(UpdatePasswordResetUseCase)
		private readonly updatePasswordResetUseCase: UpdatePasswordResetUseCase,
	) {}

	async execute(passwordReset: PasswordReset): Promise<void> {
		// Verifica se o OTP expirou
		const expirationDate = new Date(passwordReset.expiration_date);
		if (expirationDate < new Date()) {
			await this.updatePasswordResetUseCase.execute(passwordReset.id, {
				status: PASSWORD_RESET_STATUS.EXPIRED,
			});

			throw new BadRequestException('Código OTP expirado.');
		}
	}
}
