import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
	@ApiProperty({ example: '2026-08-20T09:00:00-03:00' })
	@IsISO8601()
	appointment_date: string;

	@ApiProperty()
	@IsUUID()
	@IsNotEmpty()
	professional_id: string;

	@ApiProperty()
	@IsUUID()
	@IsNotEmpty()
	customer_id: string;

	@ApiProperty()
	@IsUUID()
	@IsNotEmpty()
	organization_service_id: string;
}
