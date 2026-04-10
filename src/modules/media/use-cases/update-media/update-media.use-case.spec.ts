import { MediaOwnerType } from '@/shared/enums/media-owner-type.enum';
import type { Media } from '../../models/entities/media.entity';
import type { MediaRepositoryInterface } from '../../models/interfaces/media-repository.interface';
import type { StorageProviderInterface, UploadStorageObjectResult } from '../../models/interfaces/storage-provider.interface';
import type { MediaImageProcessorService } from '../../services/media-image-processor.service';
import type { GetExistingMediaUseCase } from '../get-existing-media/get-existing-media.use-case';
import type { PresignMediaUrlsUseCase } from '../presign-media-urls/presign-media-urls.use-case';
import { UpdateMediaUseCase } from './update-media.use-case';

type MockMediaRepository = Pick<MediaRepositoryInterface, 'create' | 'save' | 'deleteById'>;
type MockStorageProvider = Pick<StorageProviderInterface, 'upload' | 'replace' | 'delete'>;
type MockMediaImageProcessorService = Pick<MediaImageProcessorService, 'execute'>;
type MockGetExistingMediaUseCase = Pick<GetExistingMediaUseCase, 'execute'>;
type MockPresignMediaUrlsUseCase = Pick<PresignMediaUrlsUseCase, 'execute'>;

const createMediaFixture = (): Media =>
	({
		id: 'media-1',
		organization_id: 'org-1',
		owner_type: MediaOwnerType.USER_PROFILE,
		owner_id: 'owner-1',
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

describe('UpdateMediaUseCase', () => {
	let mediaRepository: jest.Mocked<MockMediaRepository>;
	let storageProvider: jest.Mocked<MockStorageProvider>;
	let mediaImageProcessorService: jest.Mocked<MockMediaImageProcessorService>;
	let getExistingMediaUseCase: jest.Mocked<MockGetExistingMediaUseCase>;
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

		getExistingMediaUseCase = {
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

	it('deve substituir objeto e remover o anterior', async () => {
		const currentMedia = createMediaFixture();
		currentMedia.storage_key = 'qkly-media/org-1/2026/04/user/old.webp';

		const processedFile = {
			buffer: Buffer.from('optimized'),
			mime_type: 'image/webp',
			extension: 'webp',
			size: 120,
			original_filename: 'novo.png',
		};

		getExistingMediaUseCase.execute.mockResolvedValue(currentMedia);
		mediaImageProcessorService.execute.mockResolvedValue(processedFile);
		storageProvider.replace.mockImplementation(async (params) => ({
			...createUploadResult(params.storage_key),
			storage_key: params.storage_key,
		}));
		mediaRepository.save.mockResolvedValue(currentMedia);

		const useCase = new UpdateMediaUseCase(
			mediaRepository as unknown as MediaRepositoryInterface,
			storageProvider as StorageProviderInterface,
			mediaImageProcessorService as unknown as MediaImageProcessorService,
			getExistingMediaUseCase as unknown as GetExistingMediaUseCase,
			presignMediaUrlsUseCase as unknown as PresignMediaUrlsUseCase,
		);

		await useCase.execute({
			id: 'media-1',
			organization_id: 'org-1',
			buffer: Buffer.from('raw'),
			mime_type: 'image/png',
			original_filename: 'novo.png',
		});

		expect(storageProvider.replace).toHaveBeenCalledTimes(1);
		expect(mediaRepository.save).toHaveBeenCalledTimes(1);
		expect(storageProvider.delete).toHaveBeenCalledWith({ storage_key: 'qkly-media/org-1/2026/04/user/old.webp' });
	});
});
