import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { OrganizationService } from '@/modules/organization-services/models/entities/organization-service.entity';
import { Organization } from '@/modules/organizations/models/entities/organization.entity';
import { User } from '@/modules/users/models/entities/user.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';
import {
	MEDIA_OWNER_TYPE_ORGANIZATION_LOGO_PARTIAL_UNIQUE_INDEX_WHERE,
	MEDIA_OWNER_TYPE_USER_PROFILE_PARTIAL_UNIQUE_INDEX_WHERE,
	type MediaOwnerType,
} from '@/shared/enums/media-owner-type.enum';

@Entity('media')
@Index(['organization_id', 'owner_type', 'owner_id'])
@Index(['organization_id', 'user_id'])
@Index(['organization_id', 'organization_service_id'])
@Index('UQ_MEDIA_USER_PROFILE_PER_ORGANIZATION', ['organization_id', 'user_id'], {
	unique: true,
	where: MEDIA_OWNER_TYPE_USER_PROFILE_PARTIAL_UNIQUE_INDEX_WHERE,
})
@Index('UQ_MEDIA_ORGANIZATION_LOGO', ['organization_id'], {
	unique: true,
	where: MEDIA_OWNER_TYPE_ORGANIZATION_LOGO_PARTIAL_UNIQUE_INDEX_WHERE,
})
@Index(['organization_id', 'storage_key'], { unique: true })
export class Media extends TimestampedEntity {
	@Column({ name: 'organization_id' })
	organization_id: string;

	@ManyToOne(
		() => Organization,
		(organization) => organization.media,
		{ onDelete: 'CASCADE' },
	)
	@JoinColumn({ name: 'organization_id' })
	organization: Organization;

	@Column({ name: 'owner_type', type: 'varchar', length: 80 })
	owner_type: MediaOwnerType;

	@Column({ name: 'owner_id' })
	owner_id: string;

	@Column({ name: 'user_id', nullable: true })
	user_id?: string | null;

	@ManyToOne(
		() => User,
		(user) => user.medias,
		{ nullable: true, onDelete: 'SET NULL' },
	)
	@JoinColumn({ name: 'user_id' })
	user?: User | null;

	@Column({ name: 'organization_service_id', nullable: true })
	organization_service_id?: string | null;

	@ManyToOne(() => OrganizationService, { nullable: true, onDelete: 'CASCADE' })
	@JoinColumn({ name: 'organization_service_id' })
	organization_service?: OrganizationService | null;

	@Column({ name: 'storage_key', length: 220 })
	storage_key: string;

	url?: string;

	@Column({ name: 'mime_type', length: 160 })
	mime_type: string;

	@Column({ name: 'extension', length: 20 })
	extension: string;

	@Column({ name: 'size', type: 'bigint' })
	size: number;

	@Column({ name: 'original_filename', length: 255 })
	original_filename: string;

	@Column({ name: 'checksum', nullable: true, length: 128 })
	checksum?: string;
}
