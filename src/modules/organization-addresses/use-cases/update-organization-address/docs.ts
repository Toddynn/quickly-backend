import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateOrganizationAddressDto } from '../../models/dto/input/update-organization-address.dto';

export function UpdateOrganizationAddressDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Update an organization address',
			description: 'Updates an existing organization address with new data.',
		}),
		ApiParam({
			name: 'id',
			description: 'Organization address ID',
			type: String,
		}),
		ApiBody({
			type: UpdateOrganizationAddressDto,
			description: 'Data for organization address update',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Organization address updated successfully.',
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Organization address not found.',
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Invalid data for organization address update.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while updating organization address.',
		}),
	);
}

