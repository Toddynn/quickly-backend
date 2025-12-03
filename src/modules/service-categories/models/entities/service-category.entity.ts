import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Organization } from '@/modules/organizations/models/entities/organization.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';

@Entity('service_categories')
export class ServiceCategory extends TimestampedEntity {
	@Column({ name: 'name' })
	name: string;

	@Column({ name: 'organization_id' })
	organization_id: string;

	@Column({ nullable: true, name: 'description' })
	description: string;

	@ManyToOne(() => Organization)
	@JoinColumn({ name: 'organization_id' })
	organization: Organization;
}
