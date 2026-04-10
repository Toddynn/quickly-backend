import { Inject, Injectable } from '@nestjs/common';
import type { FindOneOptions } from 'typeorm';
import { formatWhereClause } from '@/shared/helpers/format-where-clause.helper';
import { normalizeGetExistingOptions } from '@/shared/helpers/normalize-get-existing-options.helper';
import type { GetExistingOptions } from '@/shared/interfaces/get-existing-options';
import { NotFoundMediaException } from '../../errors/not-found-media.error';
import type { Media } from '../../models/entities/media.entity';
import type { MediaRepositoryInterface } from '../../models/interfaces/media-repository.interface';
import { MEDIA_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class GetExistingMediaUseCase {
	constructor(
		@Inject(MEDIA_REPOSITORY_INTERFACE_KEY)
		private readonly mediaRepository: MediaRepositoryInterface,
	) {}

	async execute(criteria: FindOneOptions<Media>, options: GetExistingOptions = {}): Promise<Media | null> {
		const { throwIfFound, throwIfNotFound } = normalizeGetExistingOptions(options);
		const fields = formatWhereClause(criteria.where || {});
		const media = await this.mediaRepository.findOne(criteria);

		if (!media) {
			if (throwIfNotFound) {
				throw new NotFoundMediaException(fields);
			}

			return null;
		}

		if (throwIfFound) {
			throw new NotFoundMediaException(fields);
		}

		return media;
	}
}
