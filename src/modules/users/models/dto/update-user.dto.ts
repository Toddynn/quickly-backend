import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserDto {
	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ description: 'The name of the user' })
	name?: string;

	@IsPhoneNumber('BR', { message: `O telefone deve ser um número de telefone válido.` })
	@IsOptional()
	@ApiPropertyOptional({ description: 'The phone of the user' })
	phone?: string;
}
