import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateOrganizationAddressDto } from '../../models/dto/input/create-organization-address.dto';
import { OrganizationAddress } from '../../models/entities/organization-address.entity';

export function CreateOrganizationAddressDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Create a new organization address',
			description: 'Creates a new address for an organization with data from ViaCEP API.',
		}),
		ApiBody({
			type: CreateOrganizationAddressDto,
			description: 'Data for organization address creation',
		}),
		ApiResponse({
			status: HttpStatus.CREATED,
			description: 'Organization address created successfully.',
			type: OrganizationAddress,
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Invalid data for organization address creation.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while creating organization address.',
		}),
	);
}

