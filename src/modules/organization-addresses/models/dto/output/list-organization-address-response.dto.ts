import { OmitType } from '@nestjs/swagger';
import { OrganizationAddressDto } from './organization-address.dto';

export class ListOrganizationAddressResponseDto extends OmitType(OrganizationAddressDto, ['organization']) {}

