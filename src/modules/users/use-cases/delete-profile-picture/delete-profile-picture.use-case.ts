import { Inject, Injectable } from '@nestjs/common';
import { DeleteUserProfilePictureMediaUseCase } from '@/modules/media/use-cases/delete-user-profile-picture-media/delete-user-profile-picture-media.use-case';
import type { User } from '../../models/entities/user.entity';
import { GetExistingUserUseCase } from '../get-existing-user/get-existing-user.use-case';

export interface DeleteProfilePictureInput {
	user_id: string;
	organization_id: string;
}

@Injectable()
export class DeleteProfilePictureUseCase {
	constructor(
		@Inject(GetExistingUserUseCase)
		private readonly getExistingUserUseCase: GetExistingUserUseCase,
		@Inject(DeleteUserProfilePictureMediaUseCase)
		private readonly deleteUserProfilePictureMediaUseCase: DeleteUserProfilePictureMediaUseCase,
	) {}

	async execute(input: DeleteProfilePictureInput): Promise<User> {
		await this.getExistingUserUseCase.execute({ where: { id: input.user_id } });

		const medias = await this.deleteUserProfilePictureMediaUseCase.execute({
			organization_id: input.organization_id,
			user_id: input.user_id,
		});

		const user = await this.getExistingUserUseCase.execute({ where: { id: input.user_id } });

		return Object.assign(user, { medias }) as User;
	}
}
