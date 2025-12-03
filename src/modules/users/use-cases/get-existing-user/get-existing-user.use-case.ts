import { Inject, Injectable } from '@nestjs/common';
import type { FindOneOptions } from 'typeorm';
import { ThrowsException } from '@/shared/decorators/api-metadata-exceptions.decorator';
import { formatWhereClause } from '@/shared/helpers/format-where-clause.helper';
import { normalizeGetExistingOptions } from '@/shared/helpers/normalize-get-existing-options.helper';
import type { GetExistingOptions } from '@/shared/interfaces/get-existing-options';
import { NotFoundUserException } from '../../errors/not-found-user.error';
import { UserAlreadyExistsException } from '../../errors/user-already-exists.error';
import type { User } from '../../models/entities/user.entity';
import type { UsersRepositoryInterface } from '../../models/interfaces/repository.interface';
import { USER_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class GetExistingUserUseCase {
	constructor(
		@Inject(USER_REPOSITORY_INTERFACE_KEY)
		private readonly usersRepository: UsersRepositoryInterface,
	) {}

	@ThrowsException(NotFoundUserException)
	@ThrowsException(UserAlreadyExistsException)
	async execute(criteria: FindOneOptions<User>, options: GetExistingOptions = {}): Promise<User | null> {
		const { throwIfFound, throwIfNotFound } = normalizeGetExistingOptions(options);
		const fields = formatWhereClause(criteria.where || {});

		const user = await this.usersRepository.findOne(criteria);

		if (!user) {
			if (throwIfNotFound) {
				throw new NotFoundUserException(fields);
			}
			return null;
		}

		if (throwIfFound) {
			throw new UserAlreadyExistsException(fields);
		}

		return user;
	}
}
