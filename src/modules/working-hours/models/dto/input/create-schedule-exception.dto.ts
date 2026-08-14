import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsMilitaryTime, IsOptional, IsString } from 'class-validator';

export class CreateScheduleExceptionDto {
	@ApiProperty({ example: '2026-01-10' })
	@IsDateString()
	start_date: string;

	@ApiProperty({ example: '2026-01-24' })
	@IsDateString()
	end_date: string;

	@ApiProperty({ description: 'false = folga/férias no período inteiro. true = disponível com horário customizado.' })
	@IsBoolean()
	is_available: boolean;

	@ApiPropertyOptional({ example: '09:00' })
	@IsOptional()
	@IsMilitaryTime()
	start_time?: string;

	@ApiPropertyOptional({ example: '22:00' })
	@IsOptional()
	@IsMilitaryTime()
	end_time?: string;

	@ApiPropertyOptional({ example: 'Férias' })
	@IsOptional()
	@IsString()
	reason?: string;
}
