import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DayOfWeek } from '../../../shared/enums/day-of-week.enum';

export class WorkingHoursDto {
	@ApiProperty({ enum: DayOfWeek }) day_of_week: DayOfWeek;
	@ApiProperty() is_closed: boolean;
	@ApiPropertyOptional() start_time?: string | null;
	@ApiPropertyOptional() end_time?: string | null;
}
