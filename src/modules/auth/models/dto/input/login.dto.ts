import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
	@IsString()
	@IsNotEmpty()
	@IsEmail({}, { message: 'O email deve ser um email válido.' })
	@ApiProperty({ description: 'The email of the user' })
	email: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ description: 'The password of the user' })
	password: string;

	@IsOptional()
	@IsBoolean()
	@ApiPropertyOptional({
		description: 'When true, idle timeout is extended (remember-me). Defaults to false.',
		default: false,
	})
	rememberMe?: boolean;
}
