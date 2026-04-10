import { Inject, Injectable } from '@nestjs/common';
import type { DeleteMediaDto } from '../../models/dto/input/delete-media.dto';
import type { MediaRepositoryInterface } from '../../models/interfaces/media-repository.interface';
import type { StorageProviderInterface } from '../../models/interfaces/storage-provider.interface';
import { MEDIA_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { STORAGE_PROVIDER_INTERFACE_KEY } from '../../shared/constants/storage-provider-interface-key';
import { GetExistingMediaUseCase } from '../get-existing-media/get-existing-media.use-case';

@Injectable()
export class DeleteMediaUseCase {
	constructor(
		@Inject(MEDIA_REPOSITORY_INTERFACE_KEY)
		private readonly mediaRepository: MediaRepositoryInterface,
		@Inject(STORAGE_PROVIDER_INTERFACE_KEY)
		private readonly storageProvider: StorageProviderInterface,
		@Inject(GetExistingMediaUseCase)
		private readonly getExistingMediaUseCase: GetExistingMediaUseCase,
	) {}

	async execute(deleteMediaDto: DeleteMediaDto): Promise<void> {
		const media = await this.getExistingMediaUseCase.execute({
			where: {
				id: deleteMediaDto.id,
				organization_id: deleteMediaDto.organization_id,
			},
		});

		await this.storageProvider.delete({ storage_key: media.storage_key });
		await this.mediaRepository.deleteById(media.id, media.organization_id);
	}
}
