import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '@/modules/users/models/entities/user.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';
import { Organization } from '../../../organizations/models/entities/organization.entity';

@Entity('organization_members')
export class OrganizationMember extends TimestampedEntity {
	@Column({ name: 'organization_id' })
	@ApiProperty({ description: 'The organization ID' })
	organization_id: string;

	@Column({ name: 'user_id' })
	@ApiProperty({ description: 'The user ID' })
	user_id: string;

	@Column({ name: 'active', default: true })
	@ApiProperty({ description: 'Whether the member is active', default: true })
	active: boolean;

	@ManyToOne(
		() => Organization,
		(organization) => organization.organizationMembers,
	)
	@JoinColumn({ name: 'organization_id' })
	@ApiProperty({ description: 'The organization', type: () => Organization })
	organization: Organization;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	@ApiProperty({ description: 'The user', type: () => User })
	user: User;
}
