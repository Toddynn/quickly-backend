import { OmitType } from '@nestjs/swagger';
import { OrganizationInviteDto } from './organization-invite.dto';

export class ListOrganizationInviteResponseDto extends OmitType(OrganizationInviteDto, ['organization', 'inviter']) {}

