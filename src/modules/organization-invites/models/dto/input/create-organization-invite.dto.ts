import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOrganizationInviteDto {
	@IsUUID()
	@IsNotEmpty()
	@ApiProperty({ description: 'The organization ID' })
	organization_id: string;

	@IsUUID()
	@IsNotEmpty()
	@ApiProperty({ description: 'The user ID who is sending the invite' })
	inviter_id: string;

	@IsEmail()
	@IsNotEmpty()
	@ApiProperty({ description: 'The email of the invited user' })
	email: string;
}

