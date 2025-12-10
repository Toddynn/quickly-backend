import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({ description: 'The temporary token received after OTP validation' })
	reset_token: string;

	@IsString()
	@IsNotEmpty()
	@IsStrongPassword(
		{ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
		{ message: 'A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um símbolo.' },
	)
	@ApiProperty({ description: 'The new password' })
	new_password: string;
}
