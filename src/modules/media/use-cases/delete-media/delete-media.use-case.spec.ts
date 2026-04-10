import { MediaOwnerType } from '@/shared/enums/media-owner-type.enum';
import type { Media } from '../../models/entities/media.entity';
import type { MediaRepositoryInterface } from '../../models/interfaces/media-repository.interface';
import type { StorageProviderInterface } from '../../models/interfaces/storage-provider.interface';
import type { GetExistingMediaUseCase } from '../get-existing-media/get-existing-media.use-case';
import { DeleteMediaUseCase } from './delete-media.use-case';

type MockMediaRepository = Pick<MediaRepositoryInterface, 'create' | 'save' | 'deleteById'>;
type MockStorageProvider = Pick<StorageProviderInterface, 'upload' | 'replace' | 'delete'>;
type MockGetExistingMediaUseCase = Pick<GetExistingMediaUseCase, 'execute'>;

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

describe('DeleteMediaUseCase', () => {
	let mediaRepository: jest.Mocked<MockMediaRepository>;
	let storageProvider: jest.Mocked<MockStorageProvider>;
	let getExistingMediaUseCase: jest.Mocked<MockGetExistingMediaUseCase>;

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

		getExistingMediaUseCase = {
			execute: jest.fn(),
		};
	});

	it('deve remover do storage e do banco', async () => {
		const media = createMediaFixture();
		getExistingMediaUseCase.execute.mockResolvedValue(media);

		const useCase = new DeleteMediaUseCase(
			mediaRepository as unknown as MediaRepositoryInterface,
			storageProvider as StorageProviderInterface,
			getExistingMediaUseCase as unknown as GetExistingMediaUseCase,
		);

		await useCase.execute({
			id: media.id,
			organization_id: media.organization_id,
		});

		expect(storageProvider.delete).toHaveBeenCalledWith({ storage_key: media.storage_key });
		expect(mediaRepository.deleteById).toHaveBeenCalledWith(media.id, media.organization_id);
	});
});
