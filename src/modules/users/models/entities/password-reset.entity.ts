import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';
import { PASSWORD_RESET_STATUS } from '../../shared/constants/password-reset-status';
import { User } from './user.entity';

@Entity('password_resets')
export class PasswordReset extends TimestampedEntity {
	@Column({ name: 'user_id' })
	@ApiProperty({ description: 'The user ID' })
	user_id: string;

	@Column({ name: 'otp_code' })
	@ApiProperty({ description: 'The OTP code for password reset' })
	otp_code: string;

	@Column({ name: 'expiration_date', type: 'timestamp with time zone' })
	@ApiProperty({ description: 'Expiration date of the OTP' })
	expiration_date: Date;

	@Column({ name: 'status', type: 'enum', enum: PASSWORD_RESET_STATUS, default: PASSWORD_RESET_STATUS.PENDING })
	@ApiProperty({
		description: 'Status of the password reset',
		enum: PASSWORD_RESET_STATUS,
		example: PASSWORD_RESET_STATUS.PENDING,
	})
	status: PASSWORD_RESET_STATUS;

	@Column({ name: 'validated', type: 'boolean', default: false })
	@ApiProperty({ description: 'Whether the OTP has been validated' })
	validated: boolean;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	@ApiProperty({ description: 'The user', type: () => User })
	user: User;
}
