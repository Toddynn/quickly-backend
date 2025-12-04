import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { OtpCode } from '@/shared/value-objects/otp-code';
import { GetExistingUserUseCase } from '@/modules/users/use-cases/get-existing-user/get-existing-user.use-case';
import type { ValidatePasswordResetOtpDto } from '../../models/dto/input/validate-password-reset-otp.dto';
import type { PasswordResetRepositoryInterface } from '../../models/interfaces/password-reset-repository.interface';
import { PASSWORD_RESET_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/password-reset-repository-interface-key';
import { PASSWORD_RESET_STATUS } from '../../shared/interfaces/password-reset-status';
import { GetExistingPasswordResetUseCase } from '../get-existing-password-reset/get-existing-password-reset.use-case';

@Injectable()
export class ValidatePasswordResetOtpUseCase {
	constructor(
		@Inject(GetExistingUserUseCase)
		private readonly getExistingUserUseCase: GetExistingUserUseCase,
		@Inject(GetExistingPasswordResetUseCase)
		private readonly getExistingPasswordResetUseCase: GetExistingPasswordResetUseCase,
		@Inject(PASSWORD_RESET_REPOSITORY_INTERFACE_KEY)
		private readonly passwordResetRepository: PasswordResetRepositoryInterface,
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

		// Valida o formato do OTP usando o value object
		let otpCode: OtpCode;
		try {
			otpCode = OtpCode.fromString(validatePasswordResetOtpDto.otp_code);
		} catch (error) {
			throw new BadRequestException('Email ou código OTP inválido.');
		}

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

		// Verifica se o OTP expirou
		const expirationDate = new Date(passwordReset.expiration_date);
		if (expirationDate < new Date()) {
			await this.passwordResetRepository.update(passwordReset.id, { status: PASSWORD_RESET_STATUS.EXPIRED });
			throw new BadRequestException('Código OTP expirado.');
		}

		// Marca o OTP como validado
		await this.passwordResetRepository.update(passwordReset.id, { validated: true });

		return { valid: true };
	}
}

