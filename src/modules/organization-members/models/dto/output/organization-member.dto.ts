import { ApiProperty } from '@nestjs/swagger';
import { Organization } from '@/modules/organizations/models/entities/organization.entity';
import { User } from '@/modules/users/models/entities/user.entity';
import { TimestampedEntityDto } from '@/shared/dto/timestamped-entity.dto';

export class OrganizationMemberDto extends TimestampedEntityDto {
	@ApiProperty({ description: 'The organization ID' })
	organization_id: string;

	@ApiProperty({ description: 'The user ID' })
	user_id: string;

	@ApiProperty({ description: 'Whether the member is active', default: true })
	active: boolean;

	@ApiProperty({ description: 'The organization', type: () => Organization })
	organization: Organization;

	@ApiProperty({ description: 'The user', type: () => User })
	user: User;
}
