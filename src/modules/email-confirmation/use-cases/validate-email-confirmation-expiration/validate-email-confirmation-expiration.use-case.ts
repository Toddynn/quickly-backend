import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { EmailConfirmation } from '../../models/entities/email-confirmation.entity';
import { EMAIL_CONFIRMATION_STATUS } from '../../shared/interfaces/email-confirmation-status';
import { UpdateEmailConfirmationUseCase } from '../update-email-confirmation/update-email-confirmation.use-case';

@Injectable()
export class ValidateEmailConfirmationExpirationUseCase {
	constructor(
		@Inject(UpdateEmailConfirmationUseCase)
		private readonly updateEmailConfirmationUseCase: UpdateEmailConfirmationUseCase,
	) {}

	async execute(emailConfirmation: EmailConfirmation): Promise<void> {
		const expirationDate = new Date(emailConfirmation.expiration_date);
		if (expirationDate < new Date()) {
			await this.updateEmailConfirmationUseCase.execute(emailConfirmation.id, {
				status: EMAIL_CONFIRMATION_STATUS.EXPIRED,
			});

			throw new BadRequestException('Código OTP expirado.');
		}
	}
}
