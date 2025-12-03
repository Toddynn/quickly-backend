import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '@/shared/dto/pagination.dto';

export class ListServiceCategoriesDto extends PaginationDto {
	@IsUUID()
	@IsOptional()
	@ApiPropertyOptional({ description: 'Filter by organization ID' })
	organization_id?: string;
}



