import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Organization } from '../../models/entities/organization.entity';

export function GetOrganizationDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Get an organization by ID',
			description: 'Returns the data of a specific organization by its ID.',
		}),
		ApiParam({
			name: 'id',
			description: 'Organization ID',
			type: String,
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Organization found successfully.',
			type: Organization,
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Organization not found.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while fetching organization.',
		}),
	);
}
