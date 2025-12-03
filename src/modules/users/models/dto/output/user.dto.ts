import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TimestampedEntityDto } from '@/shared/dto/timestamped-entity.dto';

export class UserDto extends TimestampedEntityDto {
	@ApiProperty({ description: 'The name of the user' })
	name: string;

	@ApiProperty({ description: 'The email of the user' })
	email: string;

	@ApiProperty({ description: 'The password of the user' })
	password: string;

	@ApiPropertyOptional({ description: 'The phone of the user' })
	phone?: string;
}
