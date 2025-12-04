import { Inject, Injectable } from '@nestjs/common';
import { PASSWORD_RESET_STATUS } from '../../shared/interfaces/password-reset-status';
import { UpdatePasswordResetUseCase } from '../update-password-reset/update-password-reset.use-case';

@Injectable()
export class MarkPasswordResetAsUsedUseCase {
	constructor(
		@Inject(UpdatePasswordResetUseCase)
		private readonly updatePasswordResetUseCase: UpdatePasswordResetUseCase,
	) {}

	async execute(passwordResetId: string): Promise<void> {
		await this.updatePasswordResetUseCase.execute(passwordResetId, {
			status: PASSWORD_RESET_STATUS.USED,
		});
	}
}
