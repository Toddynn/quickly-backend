import { ApiProperty } from '@nestjs/swagger';
import { INVITE_STATUS } from '@/modules/organization-invites/shared/interfaces/invite-status';
import { Organization } from '@/modules/organizations/models/entities/organization.entity';
import { User } from '@/modules/users/models/entities/user.entity';
import { TimestampedEntityDto } from '@/shared/dto/timestamped-entity.dto';

export class OrganizationInviteDto extends TimestampedEntityDto {
	@ApiProperty({ description: 'The organization ID' })
	organization_id: string;

	@ApiProperty({ description: 'The user ID who sent the invite' })
	inviter_id: string;

	@ApiProperty({ description: 'The email of the invited user' })
	email: string;

	@ApiProperty({ description: 'Expiration date of the invite' })
	expiration_date: Date;

	@ApiProperty({
		description: 'Status of the invite',
		enum: INVITE_STATUS,
		example: INVITE_STATUS.PENDING,
	})
	status: INVITE_STATUS;

	@ApiProperty({ description: 'The organization', type: () => Organization })
	organization: Organization;

	@ApiProperty({ description: 'The user who sent the invite', type: () => User })
	inviter: User;
}
