import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { OrganizationAddress } from '../../models/entities/organization-address.entity';

export function GetOrganizationAddressDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Get an organization address by ID',
			description: 'Returns the data of a specific organization address by its ID.',
		}),
		ApiParam({
			name: 'id',
			description: 'Organization address ID',
			type: String,
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Organization address found successfully.',
			type: OrganizationAddress,
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Organization address not found.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while fetching organization address.',
		}),
	);
}

