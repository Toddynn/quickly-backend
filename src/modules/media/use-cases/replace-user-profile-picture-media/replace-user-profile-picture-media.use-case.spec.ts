import { MediaOwnerType } from '@/shared/enums/media-owner-type.enum';
import type { Media } from '../../models/entities/media.entity';
import type { CreateMediaUseCase } from '../create-media/create-media.use-case';
import type { DeleteMediaUseCase } from '../delete-media/delete-media.use-case';
import type { ListMediaUseCase } from '../list-media/list-media.use-case';
import { ReplaceUserProfilePictureMediaUseCase } from './replace-user-profile-picture-media.use-case';

describe('ReplaceUserProfilePictureMediaUseCase', () => {
	let listMediaUseCase: jest.Mocked<Pick<ListMediaUseCase, 'execute'>>;
	let createMediaUseCase: jest.Mocked<Pick<CreateMediaUseCase, 'execute'>>;
	let deleteMediaUseCase: jest.Mocked<Pick<DeleteMediaUseCase, 'execute'>>;

	const newMedia: Media = { id: 'media-new' } as Media;

	beforeEach(() => {
		listMediaUseCase = { execute: jest.fn() };
		createMediaUseCase = { execute: jest.fn() };
		deleteMediaUseCase = { execute: jest.fn() };
	});

	it('deve remover fotos de perfil anteriores no tenant, criar uma nova e retornar somente ela', async () => {
		listMediaUseCase.execute.mockResolvedValueOnce([{ id: 'media-old' } as Media]);
		createMediaUseCase.execute.mockResolvedValue(newMedia);

		const useCase = new ReplaceUserProfilePictureMediaUseCase(
			listMediaUseCase as unknown as ListMediaUseCase,
			createMediaUseCase as unknown as CreateMediaUseCase,
			deleteMediaUseCase as unknown as DeleteMediaUseCase,
		);

		const result = await useCase.execute({
			organization_id: 'org-1',
			user_id: 'user-1',
			buffer: Buffer.from('x'),
			mime_type: 'image/png',
			original_filename: 'p.png',
		});

		expect(listMediaUseCase.execute).toHaveBeenCalledTimes(1);
		expect(listMediaUseCase.execute).toHaveBeenCalledWith({
			where: {
				organization_id: 'org-1',
				owner_type: MediaOwnerType.USER_PROFILE,
				owner_id: 'user-1',
			},
			order: { created_at: 'DESC' },
		});
		expect(deleteMediaUseCase.execute).toHaveBeenCalledWith({ id: 'media-old', organization_id: 'org-1' });
		expect(createMediaUseCase.execute).toHaveBeenCalledWith(
			expect.objectContaining({
				organization_id: 'org-1',
				user_id: 'user-1',
				owner_id: 'user-1',
				owner_type: MediaOwnerType.USER_PROFILE,
			}),
		);
		expect(result).toEqual([newMedia]);
	});
});
