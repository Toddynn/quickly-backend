import { Inject, Injectable } from '@nestjs/common';
import type { UpdateEmailConfirmationDto } from '../../models/dto/input/update-email-confirmation.dto';
import type { EmailConfirmationRepositoryInterface } from '../../models/interfaces/email-confirmation-repository.interface';
import { EMAIL_CONFIRMATION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/email-confirmation-repository-interface-key';

@Injectable()
export class UpdateEmailConfirmationUseCase {
	constructor(
		@Inject(EMAIL_CONFIRMATION_REPOSITORY_INTERFACE_KEY)
		private readonly emailConfirmationRepository: EmailConfirmationRepositoryInterface,
	) {}

	async execute(emailConfirmationId: string, updateEmailConfirmationDto: UpdateEmailConfirmationDto): Promise<void> {
		await this.emailConfirmationRepository.update(emailConfirmationId, updateEmailConfirmationDto);
	}
}

