import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Organization } from '@/modules/organizations/models/entities/organization.entity';
import { ServiceCategory } from '@/modules/service-categories/models/entities/service-category.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';

@Entity('organization_services')
export class OrganizationService extends TimestampedEntity {
	@Column({ name: 'organization_id' })
	organization_id: string;

	@Column({ name: 'name' })
	name: string;

	@Column({ nullable: true, name: 'description' })
	description: string;

	@Column({ type: 'decimal', precision: 10, scale: 2, name: 'price' })
	price: number;

	@Column({ name: 'duration_minutes' })
	duration_minutes: number;

	@Column({ nullable: true, name: 'service_category_id' })
	service_category_id: string;

	@Column({ name: 'active', default: true })
	active: boolean;

	@ManyToOne(() => Organization)
	@JoinColumn({ name: 'organization_id' })
	organization: Organization;

	@ManyToOne(() => ServiceCategory, { nullable: true })
	@JoinColumn({ name: 'service_category_id' })
	serviceCategory: ServiceCategory;
}
