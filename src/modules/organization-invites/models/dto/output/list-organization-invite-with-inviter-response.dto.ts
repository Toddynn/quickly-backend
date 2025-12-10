import { OmitType } from '@nestjs/swagger';
import { OrganizationInviteDto } from './organization-invite.dto';

export class ListOrganizationInviteWithInviterResponseDto extends OmitType(OrganizationInviteDto, ['organization']) {}
