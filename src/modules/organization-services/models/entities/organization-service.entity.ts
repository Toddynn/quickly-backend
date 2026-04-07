import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Organization } from '@/modules/organizations/models/entities/organization.entity';
import { ServiceCategory } from '@/modules/service-categories/models/entities/service-category.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';

@Entity('organization_services')
// Acelera consultas de serviços ativos por tenant.
@Index(['organization_id', 'active'])
// Evita serviços duplicados com o mesmo nome dentro da mesma organização.
@Index(['organization_id', 'name'], { unique: true })
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

	@ManyToOne(() => ServiceCategory)
	@JoinColumn({ name: 'service_category_id' })
	service_category: ServiceCategory;
}
