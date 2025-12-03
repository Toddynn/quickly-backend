import { OmitType } from '@nestjs/swagger';
import { OrganizationMemberDto } from './organization-member.dto';

export class ListOrganizationMemberResponseDto extends OmitType(OrganizationMemberDto, ['organization', 'user']) {}
