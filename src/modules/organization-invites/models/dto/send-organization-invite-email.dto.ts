import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class SendOrganizationInviteEmailDto {
	@IsEmail()
	@IsNotEmpty()
	@ApiProperty({ description: 'The email of the invited user' })
	email: string;

	@IsUUID()
	@IsNotEmpty()
	@ApiProperty({ description: 'The ID of the invite' })
	inviteId: string;

	@IsUUID()
	@IsNotEmpty()
	@ApiProperty({ description: 'The ID of the organization' })
	organizationId: string;
}
