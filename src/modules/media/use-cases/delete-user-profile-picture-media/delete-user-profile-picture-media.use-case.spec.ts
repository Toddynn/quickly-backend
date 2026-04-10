import { MediaOwnerType } from '@/shared/enums/media-owner-type.enum';
import type { Media } from '../../models/entities/media.entity';
import type { DeleteMediaUseCase } from '../delete-media/delete-media.use-case';
import type { ListMediaUseCase } from '../list-media/list-media.use-case';
import { DeleteUserProfilePictureMediaUseCase } from './delete-user-profile-picture-media.use-case';

describe('DeleteUserProfilePictureMediaUseCase', () => {
	let listMediaUseCase: jest.Mocked<Pick<ListMediaUseCase, 'execute'>>;
	let deleteMediaUseCase: jest.Mocked<Pick<DeleteMediaUseCase, 'execute'>>;

	const remaining: Media[] = [{ id: 'other-1' } as Media];

	beforeEach(() => {
		listMediaUseCase = { execute: jest.fn() };
		deleteMediaUseCase = { execute: jest.fn() };
	});

	it('deve remover todas as mídias de perfil do usuário no tenant e retornar as mídias restantes', async () => {
		listMediaUseCase.execute
			.mockResolvedValueOnce([{ id: 'profile-1' } as Media])
			.mockResolvedValueOnce(remaining);

		const useCase = new DeleteUserProfilePictureMediaUseCase(
			listMediaUseCase as unknown as ListMediaUseCase,
			deleteMediaUseCase as unknown as DeleteMediaUseCase,
		);

		const result = await useCase.execute({
			organization_id: 'org-1',
			user_id: 'user-1',
		});

		expect(listMediaUseCase.execute).toHaveBeenNthCalledWith(1, {
			where: {
				organization_id: 'org-1',
				owner_type: MediaOwnerType.USER_PROFILE,
				owner_id: 'user-1',
			},
			order: { created_at: 'DESC' },
		});
		expect(deleteMediaUseCase.execute).toHaveBeenCalledWith({ id: 'profile-1', organization_id: 'org-1' });
		expect(listMediaUseCase.execute).toHaveBeenNthCalledWith(2, {
			where: {
				user_id: 'user-1',
				organization_id: 'org-1',
			},
			order: { created_at: 'DESC' },
		});
		expect(result).toEqual(remaining);
	});

	it('não chama delete quando não há mídia de perfil', async () => {
		listMediaUseCase.execute.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

		const useCase = new DeleteUserProfilePictureMediaUseCase(
			listMediaUseCase as unknown as ListMediaUseCase,
			deleteMediaUseCase as unknown as DeleteMediaUseCase,
		);

		const result = await useCase.execute({
			organization_id: 'org-1',
			user_id: 'user-1',
		});

		expect(deleteMediaUseCase.execute).not.toHaveBeenCalled();
		expect(result).toEqual([]);
	});
});
