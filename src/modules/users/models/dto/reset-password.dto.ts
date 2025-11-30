import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
	@IsString()
	@IsNotEmpty()
	@IsEmail({}, { message: `O email deve ser um email válido.` })
	@ApiProperty({ description: 'The email of the user' })
	email: string;

	@IsString()
	@IsNotEmpty()
	@IsStrongPassword(
		{ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
		{ message: 'A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um símbolo.' },
	)
	@ApiProperty({ description: 'The new password' })
	new_password: string;
}

