import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateOrganizationDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({ description: 'The name of the organization' })
	name: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ description: 'The description of the organization' })
	description?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ description: 'The logo path of the organization' })
	logo?: string;

	@IsUUID()
	@IsNotEmpty()
	@ApiProperty({ description: 'The owner user ID of the organization' })
	owner_id: string;
}
