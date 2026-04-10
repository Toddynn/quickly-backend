import { Inject, Injectable } from '@nestjs/common';
import type { UpdateMediaDto } from '../../models/dto/input/update-media.dto';
import type { Media } from '../../models/entities/media.entity';
import type { MediaRepositoryInterface } from '../../models/interfaces/media-repository.interface';
import type { StorageProviderInterface } from '../../models/interfaces/storage-provider.interface';
import { MediaFileName } from '../../models/value-objects/media-file-name.value-object';
import { MediaImageProcessorService } from '../../services/media-image-processor.service';
import { MEDIA_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { STORAGE_PROVIDER_INTERFACE_KEY } from '../../shared/constants/storage-provider-interface-key';
import { GetExistingMediaUseCase } from '../get-existing-media/get-existing-media.use-case';
import { PresignMediaUrlsUseCase } from '../presign-media-urls/presign-media-urls.use-case';

@Injectable()
export class UpdateMediaUseCase {
	constructor(
		@Inject(MEDIA_REPOSITORY_INTERFACE_KEY)
		private readonly mediaRepository: MediaRepositoryInterface,
		@Inject(STORAGE_PROVIDER_INTERFACE_KEY)
		private readonly storageProvider: StorageProviderInterface,
		@Inject(MediaImageProcessorService)
		private readonly mediaImageProcessorService: MediaImageProcessorService,
		@Inject(GetExistingMediaUseCase)
		private readonly getExistingMediaUseCase: GetExistingMediaUseCase,
		@Inject(PresignMediaUrlsUseCase)
		private readonly presignMediaUrlsUseCase: PresignMediaUrlsUseCase,
	) {}

	async execute(updateMediaDto: UpdateMediaDto): Promise<Media> {
		const currentMedia = await this.getExistingMediaUseCase.execute({
			where: {
				id: updateMediaDto.id,
				organization_id: updateMediaDto.organization_id,
			},
		});

		const processedFile = await this.mediaImageProcessorService.execute({
			buffer: updateMediaDto.buffer,
			mime_type: updateMediaDto.mime_type,
			original_filename: updateMediaDto.original_filename,
		});

		const newStorageKey = MediaFileName.build({
			organization_id: currentMedia.organization_id,
			original_filename: updateMediaDto.original_filename,
			extension: processedFile.extension,
		}).getValue();

		const uploadedFile = await this.storageProvider.replace({
			storage_key: newStorageKey,
			body: processedFile.buffer,
			mime_type: processedFile.mime_type,
		});

		const previousStorageKey = currentMedia.storage_key;

		currentMedia.storage_key = uploadedFile.storage_key;
		currentMedia.mime_type = uploadedFile.mime_type;
		currentMedia.extension = processedFile.extension;
		currentMedia.size = uploadedFile.size;
		currentMedia.original_filename = updateMediaDto.original_filename;
		currentMedia.checksum = updateMediaDto.checksum;

		try {
			const updatedMedia = await this.mediaRepository.save(currentMedia);
			if (previousStorageKey !== uploadedFile.storage_key) {
				await this.storageProvider.delete({ storage_key: previousStorageKey });
			}
			await this.presignMediaUrlsUseCase.execute([updatedMedia]);
			return updatedMedia;
		} catch (error) {
			await this.storageProvider.delete({ storage_key: uploadedFile.storage_key });
			throw error;
		}
	}
}
