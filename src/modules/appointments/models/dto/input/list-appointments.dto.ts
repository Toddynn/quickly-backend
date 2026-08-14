import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '@/shared/dto/pagination.dto';
import { APPOINTMENT_STATUS } from '../../../shared/interfaces/appointment-status';

export class ListAppointmentsDto extends PaginationDto {
	@ApiPropertyOptional() @IsOptional() @IsUUID() professional_id?: string;
	@ApiPropertyOptional() @IsOptional() @IsUUID() customer_id?: string;
	@ApiPropertyOptional({ enum: APPOINTMENT_STATUS }) @IsOptional() @IsEnum(APPOINTMENT_STATUS) status?: APPOINTMENT_STATUS;
	@ApiPropertyOptional({ example: '2026-08-01' }) @IsOptional() @IsDateString() from_date?: string;
	@ApiPropertyOptional({ example: '2026-08-31' }) @IsOptional() @IsDateString() to_date?: string;
}
