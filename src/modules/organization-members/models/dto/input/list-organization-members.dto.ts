import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '@/shared/dto/pagination.dto';

export class ListOrganizationMembersDto extends PaginationDto {
	@IsUUID()
	@IsOptional()
	@ApiPropertyOptional({ description: 'Filter by organization ID' })
	organization_id?: string;

	@ApiPropertyOptional({ description: 'Filtrar por membros ativos/inativos', type: Boolean })
	@IsOptional()
	@Type(() => Boolean)
	@IsBoolean()
	is_active?: boolean;
}
