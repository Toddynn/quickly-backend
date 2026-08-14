import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ScheduleExceptionDto {
	@ApiProperty() id: string;
	@ApiProperty() professional_id: string;
	@ApiProperty() start_date: string;
	@ApiProperty() end_date: string;
	@ApiProperty() is_available: boolean;
	@ApiPropertyOptional() start_time?: string | null;
	@ApiPropertyOptional() end_time?: string | null;
	@ApiPropertyOptional() reason?: string | null;
}
