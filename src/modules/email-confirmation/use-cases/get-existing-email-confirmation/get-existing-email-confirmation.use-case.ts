import { Inject, Injectable } from '@nestjs/common';
import type { FindOneOptions } from 'typeorm';
import { formatWhereClause } from '@/shared/helpers/format-where-clause.helper';
import { normalizeGetExistingOptions } from '@/shared/helpers/normalize-get-existing-options.helper';
import type { GetExistingOptions } from '@/shared/interfaces/get-existing-options';
import { EmailConfirmationAlreadyExistsException } from '../../errors/email-confirmation-already-exists.error';
import { NotFoundEmailConfirmationException } from '../../errors/not-found-email-confirmation.error';
import type { EmailConfirmation } from '../../models/entities/email-confirmation.entity';
import type { EmailConfirmationRepositoryInterface } from '../../models/interfaces/email-confirmation-repository.interface';
import { EMAIL_CONFIRMATION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/email-confirmation-repository-interface-key';

@Injectable()
export class GetExistingEmailConfirmationUseCase {
	constructor(
		@Inject(EMAIL_CONFIRMATION_REPOSITORY_INTERFACE_KEY)
		private readonly emailConfirmationRepository: EmailConfirmationRepositoryInterface,
	) {}

	async execute(criteria: FindOneOptions<EmailConfirmation>, options: GetExistingOptions = {}): Promise<EmailConfirmation | null> {
		const { throwIfFound, throwIfNotFound } = normalizeGetExistingOptions(options);
		const fields = formatWhereClause(criteria.where || {});

		const emailConfirmation = await this.emailConfirmationRepository.findOne(criteria);

		if (!emailConfirmation) {
			if (throwIfNotFound) {
				throw new NotFoundEmailConfirmationException(fields);
			}
			return null;
		}

		if (throwIfFound) {
			throw new EmailConfirmationAlreadyExistsException(fields);
		}

		return emailConfirmation;
	}
}
