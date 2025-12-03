import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '@/modules/users/models/entities/user.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';
import { Organization } from '../../../organizations/models/entities/organization.entity';
import { INVITE_STATUS } from '../../shared/interfaces/invite-status';

@Entity('organization_invites')
export class OrganizationInvite extends TimestampedEntity {
	@Column({ name: 'organization_id' })
	organization_id: string;

	@Column({ name: 'inviter_id' })
	inviter_id: string;

	@Column({ name: 'email' })
	email: string;

	@Column({ name: 'expiration_date', type: 'timestamp with time zone' })
	expiration_date: Date;

	@Column({ name: 'status', type: 'enum', enum: INVITE_STATUS, default: INVITE_STATUS.PENDING })
	status: INVITE_STATUS;

	@ManyToOne(() => Organization)
	@JoinColumn({ name: 'organization_id' })
	organization: Organization;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'inviter_id' })
	inviter: User;
}
