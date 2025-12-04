import { ApiProperty } from '@nestjs/swagger';
import { PASSWORD_RESET_STATUS } from '@/modules/password-reset/shared/interfaces/password-reset-status';
import { User } from '@/modules/users/models/entities/user.entity';
import { TimestampedEntityDto } from '@/shared/dto/timestamped-entity.dto';

export class PasswordResetDto extends TimestampedEntityDto {
	@ApiProperty({ description: 'The user ID' })
	user_id: string;

	@ApiProperty({ description: 'The OTP code for password reset' })
	otp_code: string;

	@ApiProperty({ description: 'Expiration date of the OTP' })
	expiration_date: Date;

	@ApiProperty({
		description: 'Status of the password reset',
		enum: PASSWORD_RESET_STATUS,
		example: PASSWORD_RESET_STATUS.PENDING,
	})
	status: PASSWORD_RESET_STATUS;

	@ApiProperty({ description: 'Whether the OTP has been validated' })
	validated: boolean;

	@ApiProperty({ description: 'The user', type: () => User })
	user: User;
}
