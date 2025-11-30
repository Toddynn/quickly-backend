import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	@ApiProperty({ description: 'The name of the user' })
	name: string;

	@IsString()
	@IsNotEmpty()
	@IsEmail()
	@ApiProperty({ description: 'The email of the user' })
	email: string;

	@IsString()
	@IsNotEmpty()
	@IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
	@ApiProperty({ description: 'The password of the user' })
	password: string;
}
