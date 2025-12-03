import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { OrganizationDto } from '../../models/dto/output/organization.dto';

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
			type: OrganizationDto,
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
