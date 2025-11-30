import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function DeleteOrganizationDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Delete an organization',
			description: 'Removes an organization from the system.',
		}),
		ApiParam({
			name: 'id',
			description: 'Organization ID',
			type: String,
		}),
		ApiResponse({
			status: HttpStatus.NO_CONTENT,
			description: 'Organization deleted successfully.',
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Organization not found.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while deleting organization.',
		}),
	);
}
