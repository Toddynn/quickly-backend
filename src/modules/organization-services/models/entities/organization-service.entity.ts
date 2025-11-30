import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Organization } from '@/modules/organizations/models/entities/organization.entity';
import { ServiceCategory } from '@/modules/service-categories/models/entities/service-category.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';

@Entity('organization_services')
export class OrganizationService extends TimestampedEntity {
	@Column({ name: 'organization_id' })
	@ApiProperty({ description: 'The organization ID' })
	organization_id: string;

	@Column({ name: 'name' })
	@ApiProperty({ description: 'The name of the service' })
	name: string;

	@Column({ nullable: true, name: 'description' })
	@ApiProperty({ description: 'The description of the service' })
	description: string;

	@Column({ type: 'decimal', precision: 10, scale: 2, name: 'price' })
	@ApiProperty({ description: 'The price of the service' })
	price: number;

	@Column({ name: 'duration_minutes' })
	@ApiProperty({ description: 'The estimated duration of the service in minutes' })
	duration_minutes: number;

	@Column({ nullable: true, name: 'service_category_id' })
	@ApiProperty({ description: 'The service category ID' })
	service_category_id: string;

	@Column({ name: 'active', default: true })
	@ApiProperty({ description: 'Whether the service is active', default: true })
	active: boolean;

	@ManyToOne(() => Organization)
	@JoinColumn({ name: 'organization_id' })
	@ApiProperty({ description: 'The organization', type: () => Organization })
	organization: Organization;

	@ManyToOne(() => ServiceCategory, { nullable: true })
	@JoinColumn({ name: 'service_category_id' })
	@ApiProperty({ description: 'The service category', type: () => ServiceCategory, required: false })
	serviceCategory: ServiceCategory;
}
