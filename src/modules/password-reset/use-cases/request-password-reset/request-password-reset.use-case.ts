import { Inject, Injectable } from '@nestjs/common';
import { GetExistingUserUseCase } from '@/modules/users/use-cases/get-existing-user/get-existing-user.use-case';
import { OtpCode } from '@/shared/value-objects/otp-code';
import type { CreatePasswordResetDto } from '../../models/dto/input/create-password-reset.dto';
import type { RequestPasswordResetDto } from '../../models/dto/input/request-password-reset.dto';
import type { PasswordResetRepositoryInterface } from '../../models/interfaces/password-reset-repository.interface';
import { PASSWORD_RESET_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/password-reset-repository-interface-key';
import { PASSWORD_RESET_STATUS } from '../../shared/interfaces/password-reset-status';
import { CheckPasswordResetAttemptsUseCase } from '../check-password-reset-attempts/check-password-reset-attempts.use-case';
import { GetExistingPasswordResetUseCase } from '../get-existing-password-reset/get-existing-password-reset.use-case';
import { SendPasswordResetEmailUseCase } from '../send-password-reset-email/send-password-reset-email.use-case';
import { UpdatePasswordResetUseCase } from '../update-password-reset/update-password-reset.use-case';

@Injectable()
export class RequestPasswordResetUseCase {
	constructor(
		@Inject(PASSWORD_RESET_REPOSITORY_INTERFACE_KEY)
		private readonly passwordResetRepository: PasswordResetRepositoryInterface,
		@Inject(GetExistingUserUseCase)
		private readonly getExistingUserUseCase: GetExistingUserUseCase,
		@Inject(GetExistingPasswordResetUseCase)
		private readonly getExistingPasswordResetUseCase: GetExistingPasswordResetUseCase,
		@Inject(CheckPasswordResetAttemptsUseCase)
		private readonly checkPasswordResetAttemptsUseCase: CheckPasswordResetAttemptsUseCase,
		@Inject(UpdatePasswordResetUseCase)
		private readonly updatePasswordResetUseCase: UpdatePasswordResetUseCase,
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

		if (!user) {
			return;
		}

		// Verifica se o usuário excedeu o limite de tentativas
		await this.checkPasswordResetAttemptsUseCase.execute(user.id);

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
			await this.updatePasswordResetUseCase.execute(existingPasswordReset.id, {
				status: PASSWORD_RESET_STATUS.EXPIRED,
			});
		}

		const otpCode = OtpCode.generate();

		const expirationDate = this.generateExpirationDate();

		const createPasswordResetDto: CreatePasswordResetDto = {
			user_id: user.id,
			otp_code: otpCode.getValue(),
			expiration_date: expirationDate,
			status: PASSWORD_RESET_STATUS.PENDING,
		};

		const passwordReset = this.passwordResetRepository.create(createPasswordResetDto);

		await this.passwordResetRepository.save(passwordReset);

		await this.sendPasswordResetEmailUseCase.execute({
			email: requestPasswordResetDto.email,
			otpCode: passwordReset.otp_code,
		});
	}

	private generateExpirationDate(): Date {
		const expirationDate = new Date();
		expirationDate.setMinutes(expirationDate.getMinutes() + 5);
		return expirationDate;
	}
}
