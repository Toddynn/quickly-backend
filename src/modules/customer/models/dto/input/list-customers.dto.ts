import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from '@/shared/dto/pagination.dto';

export class ListCustomersDto extends PaginationDto {
	@IsUUID()
	@IsOptional()
	@ApiPropertyOptional({ description: 'Filter by organization ID' })
	organization_id?: string;

	@IsUUID()
	@IsOptional()
	@ApiPropertyOptional({ description: 'Filter by user ID' })
	user_id?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ description: 'Search by name, email or phone' })
	search?: string;
}

