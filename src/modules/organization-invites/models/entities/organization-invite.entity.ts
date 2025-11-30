import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '@/modules/users/models/entities/user.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';
import { Organization } from '../../../organizations/models/entities/organization.entity';
import { INVITE_STATUS } from '../../shared/constants/invite-status';

@Entity('organization_invites')
export class OrganizationInvite extends TimestampedEntity {
	@Column({ name: 'organization_id' })
	@ApiProperty({ description: 'The organization ID' })
	organization_id: string;

	@Column({ name: 'inviter_id' })
	@ApiProperty({ description: 'The user ID who sent the invite' })
	inviter_id: string;

	@Column({ name: 'email' })
	@ApiProperty({ description: 'The email of the invited user' })
	email: string;

	@Column({ name: 'expiration_date', type: 'timestamp with time zone' })
	@ApiProperty({ description: 'Expiration date of the invite' })
	expiration_date: Date;

	@Column({ name: 'status', type: 'enum', enum: INVITE_STATUS, default: INVITE_STATUS.PENDING })
	@ApiProperty({
		description: 'Status of the invite',
		enum: INVITE_STATUS,
		example: INVITE_STATUS.PENDING,
	})
	status: INVITE_STATUS;

	@ManyToOne(() => Organization)
	@JoinColumn({ name: 'organization_id' })
	@ApiProperty({ description: 'The organization', type: () => Organization })
	organization: Organization;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'inviter_id' })
	@ApiProperty({ description: 'The user who sent the invite', type: () => User })
	inviter: User;
}
