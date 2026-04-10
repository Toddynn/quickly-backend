import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { MediaOwnerType } from '@/shared/enums/media-owner-type.enum';
import type { CreateMediaDto } from '../../models/dto/input/create-media.dto';
import type { Media } from '../../models/entities/media.entity';
import type { MediaRepositoryInterface } from '../../models/interfaces/media-repository.interface';
import type { StorageProviderInterface } from '../../models/interfaces/storage-provider.interface';
import { MediaFileName } from '../../models/value-objects/media-file-name.value-object';
import { MediaImageProcessorService } from '../../services/media-image-processor.service';
import { MEDIA_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { STORAGE_PROVIDER_INTERFACE_KEY } from '../../shared/constants/storage-provider-interface-key';
import { PresignMediaUrlsUseCase } from '../presign-media-urls/presign-media-urls.use-case';

@Injectable()
export class CreateMediaUseCase {
	constructor(
		@Inject(MEDIA_REPOSITORY_INTERFACE_KEY)
		private readonly mediaRepository: MediaRepositoryInterface,
		@Inject(STORAGE_PROVIDER_INTERFACE_KEY)
		private readonly storageProvider: StorageProviderInterface,
		@Inject(MediaImageProcessorService)
		private readonly mediaImageProcessorService: MediaImageProcessorService,
		@Inject(PresignMediaUrlsUseCase)
		private readonly presignMediaUrlsUseCase: PresignMediaUrlsUseCase,
	) {}

	async execute(createMediaDto: CreateMediaDto): Promise<Media> {
		this.assertOwnerPayload(createMediaDto);

		const processedFile = await this.mediaImageProcessorService.execute({
			buffer: createMediaDto.buffer,
			mime_type: createMediaDto.mime_type,
			original_filename: createMediaDto.original_filename,
		});

		const storage_key = MediaFileName.build({
			organization_id: createMediaDto.organization_id,
			original_filename: createMediaDto.original_filename,
			extension: processedFile.extension,
		}).getValue();

		const uploadedFile = await this.storageProvider.upload({
			storage_key,
			body: processedFile.buffer,
			mime_type: processedFile.mime_type,
		});

		const media = this.mediaRepository.create({
			organization_id: createMediaDto.organization_id,
			owner_type: createMediaDto.owner_type,
			owner_id: createMediaDto.owner_id,
			user_id: createMediaDto.user_id ?? null,
			organization_service_id: createMediaDto.organization_service_id ?? null,
			storage_key: uploadedFile.storage_key,
			mime_type: uploadedFile.mime_type,
			extension: processedFile.extension,
			size: uploadedFile.size,
			original_filename: createMediaDto.original_filename,
			checksum: createMediaDto.checksum,
		});

		try {
			const saved = await this.mediaRepository.save(media);
			await this.presignMediaUrlsUseCase.execute([saved]);
			return saved;
		} catch (error) {
			await this.storageProvider.delete({ storage_key: uploadedFile.storage_key });
			throw error;
		}
	}

	private assertOwnerPayload(dto: CreateMediaDto): void {
		switch (dto.owner_type) {
			case MediaOwnerType.USER_PROFILE: {
				if (!dto.user_id || dto.user_id !== dto.owner_id) {
					throw new BadRequestException('USER_PROFILE exige user_id igual a owner_id.');
				}
				if (dto.organization_service_id) {
					throw new BadRequestException('USER_PROFILE não admite organization_service_id.');
				}
				break;
			}
			case MediaOwnerType.ORGANIZATION_LOGO: {
				if (dto.owner_id !== dto.organization_id) {
					throw new BadRequestException('ORGANIZATION_LOGO exige owner_id igual a organization_id.');
				}
				if (dto.user_id) {
					throw new BadRequestException('ORGANIZATION_LOGO não admite user_id.');
				}
				if (dto.organization_service_id) {
					throw new BadRequestException('ORGANIZATION_LOGO não admite organization_service_id.');
				}
				break;
			}
			case MediaOwnerType.ORGANIZATION_SERVICE: {
				if (!dto.organization_service_id || dto.organization_service_id !== dto.owner_id) {
					throw new BadRequestException('ORGANIZATION_SERVICE exige organization_service_id igual a owner_id.');
				}
				if (dto.user_id) {
					throw new BadRequestException('ORGANIZATION_SERVICE não admite user_id.');
				}
				break;
			}
		}
	}
}
