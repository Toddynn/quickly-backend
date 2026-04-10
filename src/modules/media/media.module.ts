import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { S3StorageProvider } from './infra/s3/s3-storage.provider';
import { Media } from './models/entities/media.entity';
import { MediaRepository } from './repository/media.repository';
import { MediaImageProcessorService } from './services/media-image-processor.service';
import { MEDIA_REPOSITORY_INTERFACE_KEY } from './shared/constants/repository-interface-key';
import { STORAGE_PROVIDER_INTERFACE_KEY } from './shared/constants/storage-provider-interface-key';
import { CreateMediaUseCase } from './use-cases/create-media/create-media.use-case';
import { DeleteMediaUseCase } from './use-cases/delete-media/delete-media.use-case';
import { DeleteUserProfilePictureMediaUseCase } from './use-cases/delete-user-profile-picture-media/delete-user-profile-picture-media.use-case';
import { GetExistingMediaUseCase } from './use-cases/get-existing-media/get-existing-media.use-case';
import { ListMediaUseCase } from './use-cases/list-media/list-media.use-case';
import { PresignMediaUrlsUseCase } from './use-cases/presign-media-urls/presign-media-urls.use-case';
import { ReplaceUserProfilePictureMediaUseCase } from './use-cases/replace-user-profile-picture-media/replace-user-profile-picture-media.use-case';
import { UpdateMediaUseCase } from './use-cases/update-media/update-media.use-case';

@Module({
	imports: [TypeOrmModule.forFeature([Media])],
	providers: [
		{
			provide: MEDIA_REPOSITORY_INTERFACE_KEY,
			useFactory: (dataSource: DataSource) => {
				return new MediaRepository(dataSource);
			},
			inject: [DataSource],
		},
		{
			provide: STORAGE_PROVIDER_INTERFACE_KEY,
			useClass: S3StorageProvider,
		},
		MediaImageProcessorService,
		PresignMediaUrlsUseCase,
		GetExistingMediaUseCase,
		ListMediaUseCase,
		CreateMediaUseCase,
		UpdateMediaUseCase,
		DeleteMediaUseCase,
		ReplaceUserProfilePictureMediaUseCase,
		DeleteUserProfilePictureMediaUseCase,
	],
	exports: [
		GetExistingMediaUseCase,
		ListMediaUseCase,
		CreateMediaUseCase,
		UpdateMediaUseCase,
		DeleteMediaUseCase,
		ReplaceUserProfilePictureMediaUseCase,
		DeleteUserProfilePictureMediaUseCase,
	],
})
export class MediaModule {}
