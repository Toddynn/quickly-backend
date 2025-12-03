import { PickType } from '@nestjs/swagger';
import { OrganizationDto } from './organization.dto';

export class CreateOrganizationDto extends PickType(OrganizationDto, ['name', 'description', 'logo', 'owner_id']) {}
