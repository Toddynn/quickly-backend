import { Inject, Injectable } from '@nestjs/common';
import type { Media } from '../../models/entities/media.entity';
import type { StorageProviderInterface } from '../../models/interfaces/storage-provider.interface';
import { STORAGE_PROVIDER_INTERFACE_KEY } from '../../shared/constants/storage-provider-interface-key';

@Injectable()
export class PresignMediaUrlsUseCase {
	constructor(
		@Inject(STORAGE_PROVIDER_INTERFACE_KEY)
		private readonly storageProvider: StorageProviderInterface,
	) {}

	async execute(medias: Media[]): Promise<Media[]> {
		if (medias.length === 0) {
			return medias;
		}

		const urls = await Promise.all(
			medias.map((media) => this.storageProvider.getPresignedGetObjectUrl({ storage_key: media.storage_key })),
		);

		for (let i = 0; i < medias.length; i++) {
			Object.assign(medias[i], { url: urls[i] });
		}

		return medias;
	}
}
