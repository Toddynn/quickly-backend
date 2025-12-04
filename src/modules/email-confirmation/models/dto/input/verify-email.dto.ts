import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({ description: 'The user ID' })
	userId: string;
}

