import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '@/shared/dto/pagination.dto';

export class ListOrganizationServicesDto extends PaginationDto {
	@IsUUID()
	@IsOptional()
	@ApiPropertyOptional({ description: 'Filter by organization ID' })
	organization_id?: string;

	@IsBoolean()
	@IsOptional()
	@ApiPropertyOptional({ description: 'Filter by active status' })
	active?: boolean;

	@IsUUID()
	@IsOptional()
	@ApiPropertyOptional({ description: 'Filter by service category ID' })
	service_category_id?: string;
}
