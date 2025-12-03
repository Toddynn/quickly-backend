import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '@/modules/users/models/entities/user.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';
import { Organization } from '../../../organizations/models/entities/organization.entity';

@Entity('organization_members')
export class OrganizationMember extends TimestampedEntity {
	@Column({ name: 'organization_id' })
	organization_id: string;

	@Column({ name: 'user_id' })
	user_id: string;

	@Column({ name: 'active', default: true })
	active: boolean;

	@ManyToOne(
		() => Organization,
		(organization) => organization.organizationMembers,
	)
	@JoinColumn({ name: 'organization_id' })
	organization: Organization;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;
}
