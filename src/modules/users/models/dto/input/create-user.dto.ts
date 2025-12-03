import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({ description: 'The name of the user' })
	name: string;

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
	@ApiProperty({ description: 'The password of the user' })
	password: string;

	@IsNotEmpty()
	@IsPhoneNumber('BR', { message: `O telefone deve ser um número de telefone válido.` })
	@ApiProperty({ description: 'The phone of the user' })
	phone: string;
}
