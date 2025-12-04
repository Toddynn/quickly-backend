import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GetExistingUserUseCase } from '@/modules/users/use-cases/get-existing-user/get-existing-user.use-case';
import { UpdateUserUseCase } from '@/modules/users/use-cases/update-user/update-user.use-case';
import { OtpCode } from '@/shared/value-objects/otp-code';
import { EmailAlreadyInUseException } from '../../errors/email-already-in-use.error';
import type { ValidateEmailConfirmationOtpDto } from '../../models/dto/input/validate-email-confirmation-otp.dto';
import { EMAIL_CONFIRMATION_STATUS } from '../../shared/interfaces/email-confirmation-status';
import { EMAIL_CONFIRMATION_TYPE } from '../../shared/interfaces/email-confirmation-type';
import { GetExistingEmailConfirmationUseCase } from '../get-existing-email-confirmation/get-existing-email-confirmation.use-case';
import { UpdateEmailConfirmationUseCase } from '../update-email-confirmation/update-email-confirmation.use-case';
import { ValidateEmailConfirmationExpirationUseCase } from '../validate-email-confirmation-expiration/validate-email-confirmation-expiration.use-case';

@Injectable()
export class ConfirmEmailUseCase {
	constructor(
		@Inject(GetExistingUserUseCase)
		private readonly getExistingUserUseCase: GetExistingUserUseCase,
		@Inject(GetExistingEmailConfirmationUseCase)
		private readonly getExistingEmailConfirmationUseCase: GetExistingEmailConfirmationUseCase,
		@Inject(UpdateEmailConfirmationUseCase)
		private readonly updateEmailConfirmationUseCase: UpdateEmailConfirmationUseCase,
		@Inject(ValidateEmailConfirmationExpirationUseCase)
		private readonly validateEmailConfirmationExpirationUseCase: ValidateEmailConfirmationExpirationUseCase,
		@Inject(UpdateUserUseCase)
		private readonly updateUserUseCase: UpdateUserUseCase,
	) {}

	async execute(validateEmailConfirmationOtpDto: ValidateEmailConfirmationOtpDto): Promise<void> {
		// 1. Find Confirmation by OTP
		const otpCode = new OtpCode(validateEmailConfirmationOtpDto.otp_code);

		const emailConfirmation = await this.getExistingEmailConfirmationUseCase.execute(
			{
				where: {
					otp_code: otpCode.getValue(),
					status: EMAIL_CONFIRMATION_STATUS.PENDING,
					validated: true,
				},
			},
			{ throwIfNotFound: false },
		);

		if (!emailConfirmation) {
			throw new BadRequestException('Nenhum código OTP validado encontrado. Por favor, valide o código OTP primeiro.');
		}

		// 2. Find User
		const user = await this.getExistingUserUseCase.execute({
			where: { id: emailConfirmation.user_id },
		});

		// 3. Validate Expiration
		await this.validateEmailConfirmationExpirationUseCase.execute(emailConfirmation);

		// 5. Update User based on type
		try {
			if (emailConfirmation.type === EMAIL_CONFIRMATION_TYPE.CHANGE_EMAIL) {
				// Change email and mark as verified
				if (!emailConfirmation.new_email) {
					throw new BadRequestException('Novo email não encontrado para troca de email.');
				}
				await this.updateUserUseCase.execute(user.id, {
					email: emailConfirmation.new_email,
					email_verified: true,
				});
			} else {
				// VERIFY_EMAIL: Only mark as verified, don't change email
				await this.updateUserUseCase.execute(user.id, {
					email_verified: true,
				});
			}
		} catch (error) {
			if (error.code === '23505') {
				// Unique violation
				throw new EmailAlreadyInUseException('O novo email já está em uso.');
			}
			throw error;
		}

		// 6. Mark Confirmation as Used
		await this.updateEmailConfirmationUseCase.execute(emailConfirmation.id, {
			status: EMAIL_CONFIRMATION_STATUS.USED,
			validated: true,
		});
	}
}
