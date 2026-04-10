import { Inject, Injectable } from '@nestjs/common';
import { MediaOwnerType } from '@/shared/enums/media-owner-type.enum';
import type { ReplaceUserProfilePictureMediaDto } from '../../models/dto/input/replace-user-profile-picture-media.dto';
import type { Media } from '../../models/entities/media.entity';
import { CreateMediaUseCase } from '../create-media/create-media.use-case';
import { DeleteMediaUseCase } from '../delete-media/delete-media.use-case';
import { ListMediaUseCase } from '../list-media/list-media.use-case';

@Injectable()
export class ReplaceUserProfilePictureMediaUseCase {
	constructor(
		@Inject(ListMediaUseCase)
		private readonly listMediaUseCase: ListMediaUseCase,
		@Inject(CreateMediaUseCase)
		private readonly createMediaUseCase: CreateMediaUseCase,
		@Inject(DeleteMediaUseCase)
		private readonly deleteMediaUseCase: DeleteMediaUseCase,
	) {}

	async execute(input: ReplaceUserProfilePictureMediaDto): Promise<Media[]> {
		const previousProfileMedias = await this.listMediaUseCase.execute({
			where: {
				organization_id: input.organization_id,
				owner_type: MediaOwnerType.USER_PROFILE,
				owner_id: input.user_id,
			},
			order: { created_at: 'DESC' },
		});

		for (const previous of previousProfileMedias) {
			await this.deleteMediaUseCase.execute({
				id: previous.id,
				organization_id: input.organization_id,
			});
		}

		const profileMedia = await this.createMediaUseCase.execute({
			organization_id: input.organization_id,
			owner_type: MediaOwnerType.USER_PROFILE,
			owner_id: input.user_id,
			user_id: input.user_id,
			buffer: input.buffer,
			mime_type: input.mime_type,
			original_filename: input.original_filename,
		});

		return [profileMedia];
	}
}
