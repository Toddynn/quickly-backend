import { Inject, Injectable } from '@nestjs/common';
import { UpdatePasswordResetUseCase } from '../update-password-reset/update-password-reset.use-case';

@Injectable()
export class MarkPasswordResetAsValidatedUseCase {
	constructor(
		@Inject(UpdatePasswordResetUseCase)
		private readonly updatePasswordResetUseCase: UpdatePasswordResetUseCase,
	) {}

	async execute(passwordResetId: string): Promise<void> {
		await this.updatePasswordResetUseCase.execute(passwordResetId, {
			validated: true,
		});
	}
}
