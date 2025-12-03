import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';
import { PASSWORD_RESET_STATUS } from '../../shared/interfaces/password-reset-status';
import { User } from './user.entity';

@Entity('password_resets')
export class PasswordReset extends TimestampedEntity {
	@Column({ name: 'user_id' })
	user_id: string;

	@Column({ name: 'otp_code' })
	otp_code: string;

	@Column({ name: 'expiration_date', type: 'timestamp with time zone' })
	expiration_date: Date;

	@Column({ name: 'status', type: 'enum', enum: PASSWORD_RESET_STATUS, default: PASSWORD_RESET_STATUS.PENDING })
	status: PASSWORD_RESET_STATUS;

	@Column({ name: 'validated', type: 'boolean', default: false })
	validated: boolean;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;
}
