import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCustomerDto {
	@IsUUID()
	@IsNotEmpty()
	@ApiProperty({ description: 'The organization ID' })
	organization_id: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ description: 'The customer name' })
	name: string;

	@IsOptional()
	@IsEmail()
	@ApiPropertyOptional({ description: 'The customer email' })
	email: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ description: 'The customer phone' })
	phone: string;

	@IsUUID()
	@IsOptional()
	@ApiPropertyOptional({ description: 'The user ID to link (optional, can be linked later)' })
	user_id?: string;
}
