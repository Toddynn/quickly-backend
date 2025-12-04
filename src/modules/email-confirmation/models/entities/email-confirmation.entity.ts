import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '@/modules/users/models/entities/user.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';
import { EMAIL_CONFIRMATION_STATUS } from '../../shared/interfaces/email-confirmation-status';
import { EMAIL_CONFIRMATION_TYPE } from '../../shared/interfaces/email-confirmation-type';

@Entity('email_confirmations')
export class EmailConfirmation extends TimestampedEntity {
	@Column({ name: 'user_id' })
	user_id: string;

	@Column({ name: 'new_email', nullable: true })
	new_email: string | null;

	@Column({ name: 'otp_code' })
	otp_code: string;

	@Column({ name: 'expiration_date', type: 'timestamp with time zone' })
	expiration_date: Date;

	@Column({
		name: 'status',
		type: 'enum',
		enum: EMAIL_CONFIRMATION_STATUS,
		default: EMAIL_CONFIRMATION_STATUS.PENDING,
	})
	status: EMAIL_CONFIRMATION_STATUS;

	@Column({ name: 'validated', type: 'boolean', default: false })
	validated: boolean;

	@Column({
		name: 'type',
		type: 'enum',
		enum: EMAIL_CONFIRMATION_TYPE,
		default: EMAIL_CONFIRMATION_TYPE.VERIFY_EMAIL,
	})
	type: EMAIL_CONFIRMATION_TYPE;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;
}

