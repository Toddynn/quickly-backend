import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Organization } from '@/modules/organizations/models/entities/organization.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';

@Entity('service_categories')
export class ServiceCategory extends TimestampedEntity {
	@Column({ name: 'name' })
	@ApiProperty({ description: 'The name of the service category' })
	name: string;

	@Column({ name: 'organization_id' })
	@ApiProperty({ description: 'The organization ID' })
	organization_id: string;

	@Column({ nullable: true, name: 'description' })
	@ApiProperty({ description: 'The description of the service category' })
	description: string;

	@ManyToOne(() => Organization)
	@JoinColumn({ name: 'organization_id' })
	@ApiProperty({ description: 'The organization', type: () => Organization })
	organization: Organization;
}
