import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ValidatePasswordResetOtpDto {
	@IsString()
	@IsNotEmpty()
	@IsEmail({}, { message: `O email deve ser um email válido.` })
	@ApiProperty({ description: 'The email of the user' })
	email: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ description: 'The OTP code' })
	otp_code: string;
}

