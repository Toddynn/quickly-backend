import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOrganizationMemberDto {
	@IsUUID()
	@IsNotEmpty()
	@ApiProperty({ description: 'The organization ID' })
	organization_id: string;

	@IsUUID()
	@IsNotEmpty()
	@ApiProperty({ description: 'The user ID' })
	user_id: string;
}
