import { Injectable } from '@nestjs/common';
import { type DataSource, Repository } from 'typeorm';
import { Media } from '../models/entities/media.entity';
import type { MediaRepositoryInterface } from '../models/interfaces/media-repository.interface';

@Injectable()
export class MediaRepository extends Repository<Media> implements MediaRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(Media, dataSource.createEntityManager());
	}

	findById(id: string, organization_id: string): Promise<Media | null> {
		return this.findOne({
			where: {
				id,
				organization_id,
			},
		});
	}

	findByStorageKey(storage_key: string, organization_id: string): Promise<Media | null> {
		return this.findOne({
			where: {
				storage_key,
				organization_id,
			},
		});
	}

	async deleteById(id: string, organization_id: string): Promise<void> {
		await this.delete({
			id,
			organization_id,
		});
	}
}
