import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '@/modules/users/models/entities/user.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';
import { Organization } from '../../../organizations/models/entities/organization.entity';

@Entity('organization_members')
export class OrganizationMember extends TimestampedEntity {
	@Column({ name: 'active', type: 'boolean', default: true })
	active: boolean;

	@Column({ name: 'organization_id' })
	organization_id: string;

	@Column({ name: 'user_id' })
	user_id: string;

	@ManyToOne(() => Organization)
	@JoinColumn({ name: 'organization_id' })
	organization: Organization;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;
}
