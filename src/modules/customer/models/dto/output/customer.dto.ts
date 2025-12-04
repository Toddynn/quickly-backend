import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Organization } from '@/modules/organizations/models/entities/organization.entity';
import { User } from '@/modules/users/models/entities/user.entity';
import { TimestampedEntityDto } from '@/shared/dto/timestamped-entity.dto';

export class CustomerDto extends TimestampedEntityDto {
	@ApiProperty({ description: 'The customer name' })
	name: string;

	@ApiProperty({ description: 'The customer email' })
	email: string;

	@ApiPropertyOptional({ description: 'The customer phone' })
	phone?: string;

	@ApiProperty({ description: 'The organization ID' })
	organization_id: string;

	@ApiPropertyOptional({ description: 'The user ID (nullable if customer is anonymous)' })
	user_id: string | null;

	@ApiProperty({ description: 'The organization', type: () => Organization })
	organization: Organization;

	@ApiPropertyOptional({ description: 'The user (nullable if customer is anonymous)', type: () => User })
	user: User | null;
}
