import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GetExistingUserUseCase } from '@/modules/users/use-cases/get-existing-user/get-existing-user.use-case';
import { OtpCode } from '@/shared/value-objects/otp-code';
import type { ValidatePasswordResetOtpDto } from '../../models/dto/input/validate-password-reset-otp.dto';
import { PASSWORD_RESET_STATUS } from '../../shared/interfaces/password-reset-status';
import { GetExistingPasswordResetUseCase } from '../get-existing-password-reset/get-existing-password-reset.use-case';
import { MarkPasswordResetAsValidatedUseCase } from '../mark-password-reset-as-validated/mark-password-reset-as-used.use-case';
import { ValidatePasswordResetExpirationUseCase } from '../validate-password-reset-expiration/validate-password-reset-expiration.use-case';

@Injectable()
export class ValidatePasswordResetOtpUseCase {
	constructor(
		@Inject(GetExistingUserUseCase)
		private readonly getExistingUserUseCase: GetExistingUserUseCase,
		@Inject(GetExistingPasswordResetUseCase)
		private readonly getExistingPasswordResetUseCase: GetExistingPasswordResetUseCase,
		@Inject(MarkPasswordResetAsValidatedUseCase)
		private readonly markPasswordResetAsValidatedUseCase: MarkPasswordResetAsValidatedUseCase,
		@Inject(ValidatePasswordResetExpirationUseCase)
		private readonly validatePasswordResetExpirationUseCase: ValidatePasswordResetExpirationUseCase,
	) {}

	async execute(validatePasswordResetOtpDto: ValidatePasswordResetOtpDto): Promise<{ valid: boolean }> {
		const user = await this.getExistingUserUseCase.execute(
			{
				where: { email: validatePasswordResetOtpDto.email },
			},
			{ throwIfNotFound: false },
		);

		if (!user) {
			throw new BadRequestException('Email ou código OTP inválido.');
		}

		const otpCode = new OtpCode(validatePasswordResetOtpDto.otp_code);

		const passwordReset = await this.getExistingPasswordResetUseCase.execute(
			{
				where: {
					user_id: user.id,
					otp_code: otpCode.getValue(),
					status: PASSWORD_RESET_STATUS.PENDING,
				},
			},
			{ throwIfNotFound: false },
		);

		if (!passwordReset) {
			throw new BadRequestException('Email ou código OTP inválido.');
		}

		await this.validatePasswordResetExpirationUseCase.execute(passwordReset);

		await this.markPasswordResetAsValidatedUseCase.execute(passwordReset.id);

		return { valid: true };
	}
}
