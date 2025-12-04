import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EMAIL_CONFIRMATION_STATUS } from '@/modules/email-confirmation/shared/interfaces/email-confirmation-status';
import { EMAIL_CONFIRMATION_TYPE } from '@/modules/email-confirmation/shared/interfaces/email-confirmation-type';

export class CreateEmailConfirmationDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({ description: 'The user ID' })
	user_id: string;

	@IsString()
	@IsOptional()
	@IsEmail()
	@ApiPropertyOptional({ description: 'The new email to confirm (required for CHANGE_EMAIL type)', required: false })
	new_email?: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ description: 'The OTP code' })
	otp_code: string;

	@IsDate()
	@IsNotEmpty()
	@ApiProperty({ description: 'Expiration date of the OTP' })
	expiration_date: Date;

	@IsEnum(EMAIL_CONFIRMATION_STATUS)
	@IsNotEmpty()
	@ApiProperty({
		description: 'Status of the email confirmation',
		enum: EMAIL_CONFIRMATION_STATUS,
	})
	status: EMAIL_CONFIRMATION_STATUS;

	@IsBoolean()
	@IsNotEmpty()
	@ApiProperty({ description: 'Whether the OTP has been validated' })
	validated: boolean;

	@IsEnum(EMAIL_CONFIRMATION_TYPE)
	@IsNotEmpty()
	@ApiProperty({
		description: 'Type of email confirmation',
		enum: EMAIL_CONFIRMATION_TYPE,
		default: EMAIL_CONFIRMATION_TYPE.VERIFY_EMAIL,
	})
	type: EMAIL_CONFIRMATION_TYPE;
}
