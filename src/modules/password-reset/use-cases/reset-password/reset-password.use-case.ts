import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GetExistingUserUseCase } from '@/modules/users/use-cases/get-existing-user/get-existing-user.use-case';
import { UpdateUserPasswordUseCase } from '@/modules/users/use-cases/update-user-password/update-user-password.use-case';
import { type PasswordResetTokenPayload, verifyPasswordResetToken } from '@/shared/helpers/password-reset-token.helper';
import type { ResetPasswordDto } from '../../models/dto/input/reset-password.dto';
import { PASSWORD_RESET_STATUS } from '../../shared/interfaces/password-reset-status';
import { GetExistingPasswordResetUseCase } from '../get-existing-password-reset/get-existing-password-reset.use-case';
import { MarkPasswordResetAsUsedUseCase } from '../mark-password-reset-as-used/mark-password-reset-as-used.use-case';

@Injectable()
export class ResetPasswordUseCase {
	constructor(
		@Inject(GetExistingUserUseCase)
		private readonly getExistingUserUseCase: GetExistingUserUseCase,
		@Inject(UpdateUserPasswordUseCase)
		private readonly updateUserPasswordUseCase: UpdateUserPasswordUseCase,
		@Inject(MarkPasswordResetAsUsedUseCase)
		private readonly markPasswordResetAsUsedUseCase: MarkPasswordResetAsUsedUseCase,
		@Inject(GetExistingPasswordResetUseCase)
		private readonly getExistingPasswordResetUseCase: GetExistingPasswordResetUseCase,
	) {}

	async execute(resetPasswordDto: ResetPasswordDto): Promise<void> {
		let tokenPayload: PasswordResetTokenPayload;
		try {
			tokenPayload = verifyPasswordResetToken(resetPasswordDto.reset_token);
		} catch {
			throw new BadRequestException('Token inválido ou expirado. Por favor, valide o código OTP novamente.');
		}

		const user = await this.getExistingUserUseCase.execute(
			{
				where: { id: tokenPayload.userId },
			},
			{ throwIfNotFound: true },
		);

		const alreadyUsed = await this.getExistingPasswordResetUseCase.execute(
			{
				where: {
					id: tokenPayload.passwordResetId,
					status: PASSWORD_RESET_STATUS.USED,
				},
			},
			{ throwIfNotFound: false, throwIfFound: false },
		);

		if (alreadyUsed) {
			throw new BadRequestException('Token expirado. Por favor, valide o código OTP novamente.');
		}

		await this.markPasswordResetAsUsedUseCase.execute(tokenPayload.passwordResetId);

		await this.updateUserPasswordUseCase.execute(user.id, resetPasswordDto.new_password);
	}
}
