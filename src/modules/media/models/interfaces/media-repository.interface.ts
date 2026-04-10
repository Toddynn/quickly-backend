import type { Repository } from 'typeorm';
import type { Media } from '../entities/media.entity';

export interface MediaRepositoryInterface extends Repository<Media> {
	findById(id: string, organization_id: string): Promise<Media | null>;
	findByStorageKey(storage_key: string, organization_id: string): Promise<Media | null>;
	deleteById(id: string, organization_id: string): Promise<void>;
}
