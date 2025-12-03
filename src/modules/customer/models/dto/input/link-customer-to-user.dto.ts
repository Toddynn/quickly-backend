import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class LinkCustomerToUserDto {
	@IsUUID()
	@IsNotEmpty()
	@ApiProperty({ description: 'The user ID to link to the customer' })
	user_id: string;
}

