import { MediaOwnerType } from '@/shared/enums/media-owner-type.enum';
import type { Media } from '../../models/entities/media.entity';
import type { MediaRepositoryInterface } from '../../models/interfaces/media-repository.interface';
import type { StorageProviderInterface, UploadStorageObjectResult } from '../../models/interfaces/storage-provider.interface';
import type { MediaImageProcessorService } from '../../services/media-image-processor.service';
import type { PresignMediaUrlsUseCase } from '../presign-media-urls/presign-media-urls.use-case';
import { CreateMediaUseCase } from './create-media.use-case';

type MockMediaRepository = Pick<MediaRepositoryInterface, 'create' | 'save' | 'deleteById'>;
type MockStorageProvider = Pick<StorageProviderInterface, 'upload' | 'replace' | 'delete'>;
type MockMediaImageProcessorService = Pick<MediaImageProcessorService, 'execute'>;
type MockPresignMediaUrlsUseCase = Pick<PresignMediaUrlsUseCase, 'execute'>;

const createMediaFixture = (): Media =>
	({
		id: 'media-1',
		organization_id: 'org-1',
		owner_type: MediaOwnerType.USER_PROFILE,
		owner_id: 'owner-1',
		user_id: 'owner-1',
		organization_service_id: null,
		storage_key: 'qkly-media/org-1/2026/04/user/abc.webp',
		mime_type: 'image/webp',
		extension: 'webp',
		size: 120,
		original_filename: 'foto.png',
		checksum: 'checksum',
		created_at: new Date(),
		updated_at: new Date(),
	}) as Media;

const createUploadResult = (storage_key: string): UploadStorageObjectResult => ({
	storage_key,
	size: 120,
	mime_type: 'image/webp',
});

describe('CreateMediaUseCase', () => {
	let mediaRepository: jest.Mocked<MockMediaRepository>;
	let storageProvider: jest.Mocked<MockStorageProvider>;
	let mediaImageProcessorService: jest.Mocked<MockMediaImageProcessorService>;
	let presignMediaUrlsUseCase: jest.Mocked<MockPresignMediaUrlsUseCase>;

	beforeEach(() => {
		mediaRepository = {
			create: jest.fn(),
			save: jest.fn(),
			deleteById: jest.fn(),
		};

		storageProvider = {
			upload: jest.fn(),
			replace: jest.fn(),
			delete: jest.fn(),
		};

		mediaImageProcessorService = {
			execute: jest.fn(),
		};

		presignMediaUrlsUseCase = {
			execute: jest.fn(async (medias: Media[]) => {
				for (const m of medias) {
					Object.assign(m, { url: 'https://presigned.example/object' });
				}
				return medias;
			}),
		};
	});

	it('deve processar, enviar e persistir mídia', async () => {
		const media = createMediaFixture();
		const processedFile = {
			buffer: Buffer.from('optimized'),
			mime_type: 'image/webp',
			extension: 'webp',
			size: 120,
			original_filename: 'foto.png',
		};
		const uploadResult = createUploadResult('qkly-media/org-1/2026/04/user/new.webp');

		mediaImageProcessorService.execute.mockResolvedValue(processedFile);
		storageProvider.upload.mockImplementation(async (params) => ({
			...uploadResult,
			storage_key: params.storage_key,
		}));
		mediaRepository.create.mockReturnValue(media);
		mediaRepository.save.mockResolvedValue(media);

		const useCase = new CreateMediaUseCase(
			mediaRepository as unknown as MediaRepositoryInterface,
			storageProvider as unknown as StorageProviderInterface,
			mediaImageProcessorService as unknown as MediaImageProcessorService,
			presignMediaUrlsUseCase as unknown as PresignMediaUrlsUseCase,
		);

		const result = await useCase.execute({
			organization_id: 'org-1',
			owner_type: MediaOwnerType.USER_PROFILE,
			owner_id: 'owner-1',
			user_id: 'owner-1',
			buffer: Buffer.from('raw'),
			mime_type: 'image/png',
			original_filename: 'foto.png',
			checksum: 'checksum',
		});

		expect(mediaImageProcessorService.execute).toHaveBeenCalledTimes(1);
		expect(storageProvider.upload).toHaveBeenCalledTimes(1);
		expect(mediaRepository.create).toHaveBeenCalledTimes(1);
		expect(mediaRepository.save).toHaveBeenCalledWith(media);
		expect(presignMediaUrlsUseCase.execute).toHaveBeenCalledWith([media]);
		expect(result).toBe(media);
		expect(result.url).toBe('https://presigned.example/object');
	});
});
