import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PaginationDto {
	@ApiPropertyOptional({ description: 'Número da página', default: 1, minimum: 1 })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page?: number = 1;

	@ApiPropertyOptional({ description: 'Pesquisa' })
	@IsOptional()
	@IsString()
	search?: string;

	@ApiPropertyOptional({ description: 'Quantidade de itens por página', default: 10, minimum: 1 })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	limit?: number = 10;
}

export class PaginatedResponseDto<T> {
	@ApiProperty({ description: 'Lista de itens', isArray: true })
	data: Array<T>;

	@ApiProperty({ description: 'Número da página atual' })
	page: number;

	@ApiProperty({ description: 'Quantidade de itens por página' })
	limit: number;

	@ApiProperty({ description: 'Total de itens' })
	total: number;

	@ApiProperty({ description: 'Total de páginas' })
	totalPages: number;
}
