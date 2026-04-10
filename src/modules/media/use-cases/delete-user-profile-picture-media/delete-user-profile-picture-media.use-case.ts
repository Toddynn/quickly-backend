import { Inject, Injectable } from '@nestjs/common';
import { MediaOwnerType } from '@/shared/enums/media-owner-type.enum';
import type { DeleteUserProfilePictureMediaDto } from '../../models/dto/input/delete-user-profile-picture-media.dto';
import type { Media } from '../../models/entities/media.entity';
import { DeleteMediaUseCase } from '../delete-media/delete-media.use-case';
import { ListMediaUseCase } from '../list-media/list-media.use-case';

@Injectable()
export class DeleteUserProfilePictureMediaUseCase {
	constructor(
		@Inject(ListMediaUseCase)
		private readonly listMediaUseCase: ListMediaUseCase,
		@Inject(DeleteMediaUseCase)
		private readonly deleteMediaUseCase: DeleteMediaUseCase,
	) {}

	async execute(input: DeleteUserProfilePictureMediaDto): Promise<Media[]> {
		const profileMedias = await this.listMediaUseCase.execute({
			where: {
				organization_id: input.organization_id,
				owner_type: MediaOwnerType.USER_PROFILE,
				owner_id: input.user_id,
			},
			order: { created_at: 'DESC' },
		});

		for (const media of profileMedias) {
			await this.deleteMediaUseCase.execute({
				id: media.id,
				organization_id: input.organization_id,
			});
		}

		return this.listMediaUseCase.execute({
			where: {
				user_id: input.user_id,
				organization_id: input.organization_id,
			},
			order: { created_at: 'DESC' },
		});
	}
}
