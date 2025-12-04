import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PASSWORD_RESET_STATUS } from '@/modules/password-reset/shared/interfaces/password-reset-status';

export class CreatePasswordResetDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({ description: 'The user ID' })
	user_id: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ description: 'The OTP code' })
	otp_code: string;

	@IsDate()
	@IsNotEmpty()
	@ApiProperty({ description: 'Expiration date of the OTP' })
	expiration_date: Date;

	@IsEnum(PASSWORD_RESET_STATUS)
	@IsNotEmpty()
	@ApiProperty({
		description: 'Status of the password reset',
		enum: PASSWORD_RESET_STATUS,
	})
	status: PASSWORD_RESET_STATUS;

	@IsBoolean()
	@IsNotEmpty()
	@ApiProperty({ description: 'Whether the OTP has been validated' })
	validated: boolean;
}
