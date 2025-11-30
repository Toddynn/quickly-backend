import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailDto {
	@IsEmail()
	@IsNotEmpty()
	@ApiProperty({ description: 'The email to send a message' })
	to: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ description: 'The subject of the email' })
	subject: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ description: 'The HTML template string content of the email' })
	html: string;
}
