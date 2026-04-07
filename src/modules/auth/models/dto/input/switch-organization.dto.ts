import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class SwitchOrganizationDto {
	@IsUUID()
	@IsNotEmpty()
	@ApiProperty({ description: 'The organization ID to switch to' })
	organization_id: string;
}
