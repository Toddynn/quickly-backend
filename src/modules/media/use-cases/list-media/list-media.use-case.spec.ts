import type { Media } from '../../models/entities/media.entity';
import type { MediaRepositoryInterface } from '../../models/interfaces/media-repository.interface';
import type { PresignMediaUrlsUseCase } from '../presign-media-urls/presign-media-urls.use-case';
import { ListMediaUseCase } from './list-media.use-case';

describe('ListMediaUseCase', () => {
	it('deve delegar find ao repositório e pré-assinar URLs', async () => {
		const found: Media[] = [];
		const mediaRepository = { find: jest.fn().mockResolvedValue(found) };
		const presignMediaUrlsUseCase = {
			execute: jest.fn().mockImplementation(async (medias: Media[]) => medias),
		};
		const useCase = new ListMediaUseCase(
			mediaRepository as unknown as MediaRepositoryInterface,
			presignMediaUrlsUseCase as unknown as PresignMediaUrlsUseCase,
		);

		const options = { where: { organization_id: 'org-1' } };
		await useCase.execute(options);

		expect(mediaRepository.find).toHaveBeenCalledWith(options);
		expect(presignMediaUrlsUseCase.execute).toHaveBeenCalledWith(found);
	});
});
