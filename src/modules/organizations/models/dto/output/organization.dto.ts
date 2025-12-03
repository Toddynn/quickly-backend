import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '@/modules/users/models/entities/user.entity';
import { TimestampedEntityDto } from '@/shared/dto/timestamped-entity.dto';
import { OrganizationAddress } from '../../../../organization-addresses/models/entities/organization-address.entity';
import { OrganizationMember } from '../../../../organization-members/models/entities/organization-member.entity';

export class OrganizationDto extends TimestampedEntityDto {
	@ApiProperty({ description: 'The name of the organization' })
	name: string;

	@ApiPropertyOptional({ description: 'The description of the organization' })
	description?: string;

	@ApiPropertyOptional({ description: 'The logo path of the organization' })
	logo?: string;

	@ApiProperty({ description: 'The owner user ID of the organization' })
	owner_id: string;

	@ApiProperty({ description: 'The owner user of the organization', type: () => User })
	owner: User;

	@ApiProperty({
		description: 'The members of the organization',
		type: () => [OrganizationMember],
	})
	organizationMembers: OrganizationMember[];

	@ApiProperty({
		description: 'The addresses of the organization',
		type: () => [OrganizationAddress],
	})
	addresses: OrganizationAddress[];
}
