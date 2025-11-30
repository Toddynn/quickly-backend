import { Inject, Injectable } from '@nestjs/common';
import type { FindOneOptions } from 'typeorm';
import { ThrowsException } from '@/shared/decorators/api-metadata-exceptions.decorator';
import { formatWhereClause } from '@/shared/helpers/format-where-clause.helper';
import { normalizeGetExistingOptions } from '@/shared/helpers/normalize-get-existing-options.helper';
import type { GetExistingOptions } from '@/shared/interfaces/get-existing-options.interface';
import { NotFoundPasswordResetException } from '../../errors/not-found-password-reset.error';
import { PasswordResetAlreadyExistsException } from '../../errors/password-reset-already-exists.error';
import type { PasswordReset } from '../../models/entities/password-reset.entity';
import type { PasswordResetRepositoryInterface } from '../../models/interfaces/password-reset-repository.interface';
import { PASSWORD_RESET_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/password-reset-repository-interface-key';

@Injectable()
export class GetExistingPasswordResetUseCase {
	constructor(
		@Inject(PASSWORD_RESET_REPOSITORY_INTERFACE_KEY)
		private readonly passwordResetRepository: PasswordResetRepositoryInterface,
	) {}

	@ThrowsException(NotFoundPasswordResetException)
	@ThrowsException(PasswordResetAlreadyExistsException)
	async execute(
		criteria: FindOneOptions<PasswordReset>,
		options: GetExistingOptions = {},
	): Promise<PasswordReset | null> {
		const { throwIfFound, throwIfNotFound } = normalizeGetExistingOptions(options);
		const fields = formatWhereClause(criteria.where || {});

		const passwordReset = await this.passwordResetRepository.findOne(criteria);

		if (!passwordReset) {
			if (throwIfNotFound) {
				throw new NotFoundPasswordResetException(fields);
			}
			return null;
		}

		if (throwIfFound) {
			throw new PasswordResetAlreadyExistsException(fields);
		}

		return passwordReset;
	}
}

