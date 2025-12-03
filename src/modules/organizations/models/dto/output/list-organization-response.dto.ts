import { ApiProperty, OmitType } from '@nestjs/swagger';
import { OrganizationDto } from './organization.dto';

export class ListOrganizationResponseDto extends OmitType(OrganizationDto, ['organization_members', 'addresses']) {
	@ApiProperty({ description: 'The count of members in the organization' })
	membersCount: number;
}
