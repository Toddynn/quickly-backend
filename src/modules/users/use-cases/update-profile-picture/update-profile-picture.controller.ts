import { Controller, FileTypeValidator, Inject, MaxFileSizeValidator, ParseFilePipe, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import type { Express } from 'express';
import type { SessionUser } from '@/modules/auth/models/interfaces/session-user.interface';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { CurrentUser } from '@/modules/auth/shared/decorators/current-user.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import type { User } from '../../models/entities/user.entity';
import { UpdateProfilePictureDocs } from './docs';
import { UpdateProfilePictureUseCase } from './update-profile-picture.use-case';

const PROFILE_PICTURE_MAX_BYTES = 10 * 1024 * 1024;

@ApiTags('Users')
@ApiCookieAuth()
@TenantScoped()
@Controller('users')
export class UpdateProfilePictureController {
	constructor(
		@Inject(UpdateProfilePictureUseCase)
		private readonly updateProfilePictureUseCase: UpdateProfilePictureUseCase,
	) {}

	@Patch('profile-picture')
	@UseInterceptors(FileInterceptor('file'))
	@UpdateProfilePictureDocs()
	async execute(
		@CurrentUser() sessionUser: SessionUser,
		@ActiveOrganizationId() organizationId: string,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: PROFILE_PICTURE_MAX_BYTES }),
					new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp|gif)$/ }),
				],
			}),
		)
		file: Express.Multer.File,
	): Promise<User> {
		return await this.updateProfilePictureUseCase.execute({
			user_id: sessionUser.userId,
			organization_id: organizationId,
			buffer: file.buffer,
			mime_type: file.mimetype,
			original_filename: file.originalname,
		});
	}
}
