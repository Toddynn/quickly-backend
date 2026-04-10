import { Controller, Delete, Inject } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import type { SessionUser } from '@/modules/auth/models/interfaces/session-user.interface';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { CurrentUser } from '@/modules/auth/shared/decorators/current-user.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import type { User } from '../../models/entities/user.entity';
import { DeleteProfilePictureDocs } from './docs';
import { DeleteProfilePictureUseCase } from './delete-profile-picture.use-case';

@ApiTags('Users')
@ApiCookieAuth()
@TenantScoped()
@Controller('users')
export class DeleteProfilePictureController {
	constructor(
		@Inject(DeleteProfilePictureUseCase)
		private readonly deleteProfilePictureUseCase: DeleteProfilePictureUseCase,
	) {}

	@Delete('profile-picture')
	@DeleteProfilePictureDocs()
	async execute(@CurrentUser() sessionUser: SessionUser, @ActiveOrganizationId() organizationId: string): Promise<User> {
		return await this.deleteProfilePictureUseCase.execute({
			user_id: sessionUser.userId,
			organization_id: organizationId,
		});
	}
}
