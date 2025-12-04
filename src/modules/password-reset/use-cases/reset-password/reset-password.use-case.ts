import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GetExistingUserUseCase } from '@/modules/users/use-cases/get-existing-user/get-existing-user.use-case';
import { UpdateUserPasswordUseCase } from '@/modules/users/use-cases/update-user-password/update-user-password.use-case';
import type { ResetPasswordDto } from '../../models/dto/input/reset-password.dto';
import { PASSWORD_RESET_STATUS } from '../../shared/interfaces/password-reset-status';
import { GetExistingPasswordResetUseCase } from '../get-existing-password-reset/get-existing-password-reset.use-case';
import { MarkPasswordResetAsUsedUseCase } from '../mark-password-reset-as-used/mark-password-reset-as-used.use-case';
import { ValidatePasswordResetExpirationUseCase } from '../validate-password-reset-expiration/validate-password-reset-expiration.use-case';

@Injectable()
export class ResetPasswordUseCase {
	constructor(
		@Inject(GetExistingUserUseCase)
		private readonly getExistingUserUseCase: GetExistingUserUseCase,
		@Inject(GetExistingPasswordResetUseCase)
		private readonly getExistingPasswordResetUseCase: GetExistingPasswordResetUseCase,
		@Inject(ValidatePasswordResetExpirationUseCase)
		private readonly validatePasswordResetExpirationUseCase: ValidatePasswordResetExpirationUseCase,
		@Inject(UpdateUserPasswordUseCase)
		private readonly updateUserPasswordUseCase: UpdateUserPasswordUseCase,
		@Inject(MarkPasswordResetAsUsedUseCase)
		private readonly markPasswordResetAsUsedUseCase: MarkPasswordResetAsUsedUseCase,
	) {}

	async execute(resetPasswordDto: ResetPasswordDto): Promise<void> {
		const user = await this.getExistingUserUseCase.execute(
			{
				where: { email: resetPasswordDto.email },
			},
			{ throwIfNotFound: false },
		);

		if (!user) {
			throw new BadRequestException('Email inválido.');
		}

		const passwordReset = await this.getExistingPasswordResetUseCase.execute({
			where: {
				user_id: user.id,
				status: PASSWORD_RESET_STATUS.PENDING,
				validated: true,
			},
		});

		if (!passwordReset) {
			throw new BadRequestException('Nenhum código OTP validado encontrado. Por favor, valide o código OTP primeiro.');
		}

		// Valida se o OTP expirou
		await this.validatePasswordResetExpirationUseCase.execute(passwordReset);

		// Atualiza a senha do usuário
		await this.updateUserPasswordUseCase.execute(user.id, resetPasswordDto.new_password);

		// Marca o OTP como usado
		await this.markPasswordResetAsUsedUseCase.execute(passwordReset.id);
	}
}
