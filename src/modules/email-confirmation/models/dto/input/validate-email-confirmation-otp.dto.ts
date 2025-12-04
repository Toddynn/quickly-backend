import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ValidateEmailConfirmationOtpDto {
	@IsString()
	@IsNotEmpty()
	@Length(6, 6, { message: 'O código OTP deve ter 6 dígitos.' })
	@ApiProperty({ description: 'The OTP code' })
	otp_code: string;
}
