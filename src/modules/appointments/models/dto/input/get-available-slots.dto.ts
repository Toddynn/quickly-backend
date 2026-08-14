import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsUUID } from 'class-validator';

export class GetAvailableSlotsDto {
	@ApiProperty({ example: '2026-08-20' })
	@IsDateString()
	date: string;

	@ApiProperty()
	@IsUUID()
	professional_id: string;

	@ApiProperty()
	@IsUUID()
	organization_service_id: string;
}
