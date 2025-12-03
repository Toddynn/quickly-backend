import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '@/modules/users/models/entities/user.entity';
import { OrganizationAddress } from '../../../organization-addresses/models/entities/organization-address.entity';
import { OrganizationMember } from '../../../organization-members/models/entities/organization-member.entity';

export class OrganizationDto {
	@ApiProperty({ description: 'The UUID v7 of the entity' })
	id: string;

	@ApiProperty({ description: 'The date and time when entity was created' })
	created_at: Date;

	@ApiProperty({ description: 'The date and time when entity was updated' })
	updated_at: Date;

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
