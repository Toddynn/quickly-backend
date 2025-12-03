import { OmitType } from '@nestjs/swagger';
import { OrganizationServiceDto } from './organization-service.dto';

export class ListOrganizationServiceResponseDto extends OmitType(OrganizationServiceDto, ['organization', 'serviceCategory']) {}
