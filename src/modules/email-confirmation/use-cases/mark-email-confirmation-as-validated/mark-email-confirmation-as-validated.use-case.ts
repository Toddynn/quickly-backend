import { Inject, Injectable } from '@nestjs/common';
import { UpdateEmailConfirmationUseCase } from '../update-email-confirmation/update-email-confirmation.use-case';

@Injectable()
export class MarkEmailConfirmationAsValidatedUseCase {
	constructor(
		@Inject(UpdateEmailConfirmationUseCase)
		private readonly updateEmailConfirmationUseCase: UpdateEmailConfirmationUseCase,
	) {}

	async execute(emailConfirmationId: string): Promise<void> {
		await this.updateEmailConfirmationUseCase.execute(emailConfirmationId, {
			validated: true,
		});
	}
}
