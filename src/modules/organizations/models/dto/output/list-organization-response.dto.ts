import { ApiProperty, OmitType } from '@nestjs/swagger';
import { OrganizationDto } from './organization.dto';

export class ListOrganizationResponseDto extends OmitType(OrganizationDto, ['organizationMembers', 'addresses']) {
	@ApiProperty({ description: 'The count of members in the organization' })
	membersCount: number;
}
