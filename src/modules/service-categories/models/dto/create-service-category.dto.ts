import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateServiceCategoryDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({ description: 'The name of the service category' })
	name: string;

	@IsUUID()
	@IsNotEmpty()
	@ApiProperty({ description: 'The organization ID' })
	organization_id: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ description: 'The description of the service category' })
	description?: string;
}
