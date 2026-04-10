import { Inject, Injectable } from '@nestjs/common';
import type { FindManyOptions } from 'typeorm';
import type { Media } from '../../models/entities/media.entity';
import type { MediaRepositoryInterface } from '../../models/interfaces/media-repository.interface';
import { MEDIA_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { PresignMediaUrlsUseCase } from '../presign-media-urls/presign-media-urls.use-case';

@Injectable()
export class ListMediaUseCase {
	constructor(
		@Inject(MEDIA_REPOSITORY_INTERFACE_KEY)
		private readonly mediaRepository: MediaRepositoryInterface,
		@Inject(PresignMediaUrlsUseCase)
		private readonly presignMediaUrlsUseCase: PresignMediaUrlsUseCase,
	) {}

	async execute(options: FindManyOptions<Media>): Promise<Media[]> {
		const list = await this.mediaRepository.find(options);
		return this.presignMediaUrlsUseCase.execute(list);
	}
}
