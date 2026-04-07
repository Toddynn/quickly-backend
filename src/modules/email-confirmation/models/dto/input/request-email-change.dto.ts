import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RequestEmailChangeDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({ description: 'The user ID' })
	userId: string;

	@IsString()
	@IsNotEmpty()
	@IsEmail({}, { message: 'O email deve ser um email válido.' })
	@ApiProperty({ description: 'The new email to confirm' })
	newEmail: string;
}
