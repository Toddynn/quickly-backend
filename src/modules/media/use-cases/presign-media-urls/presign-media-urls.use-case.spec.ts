import { MediaOwnerType } from '@/shared/enums/media-owner-type.enum';
import type { Media } from '../../models/entities/media.entity';
import type { StorageProviderInterface } from '../../models/interfaces/storage-provider.interface';
import { PresignMediaUrlsUseCase } from './presign-media-urls.use-case';

describe('PresignMediaUrlsUseCase', () => {
	it('deve substituir url de cada mídia pela URL pré-assinada', async () => {
		const storageProvider: Pick<StorageProviderInterface, 'getPresignedGetObjectUrl'> = {
			getPresignedGetObjectUrl: jest
				.fn()
				.mockResolvedValueOnce('https://signed.example/a')
				.mockResolvedValueOnce('https://signed.example/b'),
		};

		const m1 = {
			id: '1',
			storage_key: 'key-a',
			url: 'https://old',
			owner_type: MediaOwnerType.USER_PROFILE,
		} as Media;
		const m2 = {
			id: '2',
			storage_key: 'key-b',
			url: 'https://old',
			owner_type: MediaOwnerType.USER_PROFILE,
		} as Media;

		const useCase = new PresignMediaUrlsUseCase(storageProvider as StorageProviderInterface);
		const result = await useCase.execute([m1, m2]);

		expect(result).toEqual([m1, m2]);
		expect(m1.url).toBe('https://signed.example/a');
		expect(m2.url).toBe('https://signed.example/b');
		expect(storageProvider.getPresignedGetObjectUrl).toHaveBeenCalledWith({ storage_key: 'key-a' });
		expect(storageProvider.getPresignedGetObjectUrl).toHaveBeenCalledWith({ storage_key: 'key-b' });
	});

	it('deve retornar lista vazia sem chamar storage', async () => {
		const storageProvider: Pick<StorageProviderInterface, 'getPresignedGetObjectUrl'> = {
			getPresignedGetObjectUrl: jest.fn(),
		};

		const useCase = new PresignMediaUrlsUseCase(storageProvider as StorageProviderInterface);
		const result = await useCase.execute([]);

		expect(result).toEqual([]);
		expect(storageProvider.getPresignedGetObjectUrl).not.toHaveBeenCalled();
	});
});
