import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationDto } from '@/shared/dto/pagination.dto';

export class ListOrganizationMembersDto extends PaginationDto {
	@ApiPropertyOptional({ description: 'Filtrar por membros ativos/inativos', type: Boolean })
	@IsOptional()
	@Type(() => Boolean)
	@IsBoolean()
	is_active?: boolean;
}
