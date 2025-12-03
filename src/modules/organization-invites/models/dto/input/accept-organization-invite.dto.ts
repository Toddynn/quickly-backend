import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AcceptOrganizationInviteDto {
	@IsUUID()
	@IsNotEmpty()
	@ApiProperty({ description: 'The user ID who is accepting the invite' })
	user_id: string;
}

