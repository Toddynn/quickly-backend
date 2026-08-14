import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsBoolean, IsEnum, IsMilitaryTime, IsOptional, ValidateNested } from 'class-validator';
import { DayOfWeek } from '../../../shared/enums/day-of-week.enum';

export class WorkingHoursDayDto {
	@ApiProperty({ enum: DayOfWeek })
	@IsEnum(DayOfWeek)
	day_of_week: DayOfWeek;

	@ApiProperty({ default: false })
	@IsBoolean()
	is_closed: boolean;

	@ApiProperty({ required: false, example: '09:00' })
	@IsOptional()
	@IsMilitaryTime()
	start_time?: string;

	@ApiProperty({ required: false, example: '18:00' })
	@IsOptional()
	@IsMilitaryTime()
	end_time?: string;
}

export class SetWorkingHoursDto {
	@ApiProperty({ type: [WorkingHoursDayDto] })
	@IsArray()
	@ArrayMaxSize(7)
	@ValidateNested({ each: true })
	@Type(() => WorkingHoursDayDto)
	days: WorkingHoursDayDto[];
}
