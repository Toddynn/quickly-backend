import type { Media } from '@/modules/media/models/entities/media.entity';
import type { ReplaceUserProfilePictureMediaUseCase } from '@/modules/media/use-cases/replace-user-profile-picture-media/replace-user-profile-picture-media.use-case';
import { MediaOwnerType } from '@/shared/enums/media-owner-type.enum';
import type { User } from '../../models/entities/user.entity';
import type { GetExistingUserUseCase } from '../get-existing-user/get-existing-user.use-case';
import { UpdateProfilePictureUseCase } from './update-profile-picture.use-case';

describe('UpdateProfilePictureUseCase', () => {
	let getExistingUserUseCase: jest.Mocked<Pick<GetExistingUserUseCase, 'execute'>>;
	let replaceUserProfilePictureMediaUseCase: jest.Mocked<Pick<ReplaceUserProfilePictureMediaUseCase, 'execute'>>;

	const user: User = {
		id: 'user-1',
		name: 'Nome',
		email: 'a@b.com',
		password: 'x',
		email_verified: true,
		medias: [],
	} as User;

	const media: Media = {
		id: 'media-new',
		organization_id: 'org-1',
		owner_type: MediaOwnerType.USER_PROFILE,
		owner_id: 'user-1',
		user_id: 'user-1',
		storage_key: 'key',
		url: 'https://presigned.example/p.webp',
		mime_type: 'image/webp',
		extension: 'webp',
		size: 10,
		original_filename: 'f.png',
		created_at: new Date(),
		updated_at: new Date(),
	} as Media;

	beforeEach(() => {
		getExistingUserUseCase = { execute: jest.fn() };
		replaceUserProfilePictureMediaUseCase = { execute: jest.fn() };
	});

	it('deve validar usuário, delegar troca de mídia ao módulo media e anexar medias do tenant na resposta', async () => {
		getExistingUserUseCase.execute.mockResolvedValue(user as User);
		replaceUserProfilePictureMediaUseCase.execute.mockResolvedValue([media]);

		const useCase = new UpdateProfilePictureUseCase(
			getExistingUserUseCase as unknown as GetExistingUserUseCase,
			replaceUserProfilePictureMediaUseCase as unknown as ReplaceUserProfilePictureMediaUseCase,
		);

		const result = await useCase.execute({
			user_id: 'user-1',
			organization_id: 'org-1',
			buffer: Buffer.from('img'),
			mime_type: 'image/png',
			original_filename: 'f.png',
		});

		expect(getExistingUserUseCase.execute).toHaveBeenCalledTimes(2);
		expect(replaceUserProfilePictureMediaUseCase.execute).toHaveBeenCalledWith({
			organization_id: 'org-1',
			user_id: 'user-1',
			buffer: Buffer.from('img'),
			mime_type: 'image/png',
			original_filename: 'f.png',
		});
		expect(result.medias).toEqual([media]);
	});

	it('deve propagar erro quando replace de mídia falhar', async () => {
		getExistingUserUseCase.execute.mockResolvedValue(user as User);
		replaceUserProfilePictureMediaUseCase.execute.mockRejectedValue(new Error('s3'));

		const useCase = new UpdateProfilePictureUseCase(
			getExistingUserUseCase as unknown as GetExistingUserUseCase,
			replaceUserProfilePictureMediaUseCase as unknown as ReplaceUserProfilePictureMediaUseCase,
		);

		await expect(
			useCase.execute({
				user_id: 'user-1',
				organization_id: 'org-1',
				buffer: Buffer.from('img'),
				mime_type: 'image/png',
				original_filename: 'f.png',
			}),
		).rejects.toThrow('s3');

		expect(getExistingUserUseCase.execute).toHaveBeenCalledTimes(1);
	});
});
