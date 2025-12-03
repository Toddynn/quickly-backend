import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrganizationAddress } from '@/modules/organization-addresses/models/entities/organization-address.entity';
import { OrganizationMember } from '@/modules/organization-members/models/entities/organization-member.entity';
import { User } from '@/modules/users/models/entities/user.entity';
import { TimestampedEntityDto } from '@/shared/dto/timestamped-entity.dto';

export class OrganizationDto extends TimestampedEntityDto {
	@ApiProperty({ description: 'The unique slug of the organization (used as public tenant ID in URLs)' })
	slug: string;

	@ApiProperty({ description: 'The name of the organization' })
	name: string;

	@ApiPropertyOptional({ description: 'The description of the organization' })
	description?: string;

	@ApiPropertyOptional({ description: 'The logo path of the organization' })
	logo?: string;

	@ApiPropertyOptional({ description: 'The date and time when the organization was deleted' })
	deleted_at?: Date;

	@ApiProperty({ description: 'The owner user ID of the organization' })
	owner_id: string;

	@ApiProperty({ description: 'The owner user of the organization', type: () => User })
	owner: User;

	@ApiProperty({
		description: 'The members of the organization',
		type: () => [OrganizationMember],
	})
	organization_members: OrganizationMember[];

	@ApiProperty({
		description: 'The addresses of the organization',
		type: () => [OrganizationAddress],
	})
	addresses: OrganizationAddress[];
}
