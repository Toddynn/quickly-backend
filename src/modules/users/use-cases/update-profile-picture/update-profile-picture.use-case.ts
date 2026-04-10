import { Inject, Injectable } from '@nestjs/common';
import { ReplaceUserProfilePictureMediaUseCase } from '@/modules/media/use-cases/replace-user-profile-picture-media/replace-user-profile-picture-media.use-case';
import type { User } from '../../models/entities/user.entity';
import { GetExistingUserUseCase } from '../get-existing-user/get-existing-user.use-case';

export interface UpdateProfilePictureInput {
	user_id: string;
	organization_id: string;
	buffer: Buffer;
	mime_type: string;
	original_filename: string;
}

@Injectable()
export class UpdateProfilePictureUseCase {
	constructor(
		@Inject(GetExistingUserUseCase)
		private readonly getExistingUserUseCase: GetExistingUserUseCase,
		@Inject(ReplaceUserProfilePictureMediaUseCase)
		private readonly replaceUserProfilePictureMediaUseCase: ReplaceUserProfilePictureMediaUseCase,
	) {}

	async execute(input: UpdateProfilePictureInput): Promise<User> {
		await this.getExistingUserUseCase.execute({ where: { id: input.user_id } });

		const medias = await this.replaceUserProfilePictureMediaUseCase.execute({
			organization_id: input.organization_id,
			user_id: input.user_id,
			buffer: input.buffer,
			mime_type: input.mime_type,
			original_filename: input.original_filename,
		});

		const user = await this.getExistingUserUseCase.execute({ where: { id: input.user_id } });

		return Object.assign(user, { medias }) as User;
	}
}
