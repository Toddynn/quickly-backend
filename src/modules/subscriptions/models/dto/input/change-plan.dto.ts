import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ChangePlanDto {
	@ApiProperty({ description: 'ID of the new plan' })
	@IsUUID()
	@IsNotEmpty()
	plan_id: string;
}
