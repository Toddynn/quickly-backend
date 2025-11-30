import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function DeleteOrganizationMemberDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Remove an organization member',
			description: 'Removes the link between a user and an organization.',
		}),
		ApiParam({
			name: 'id',
			description: 'Organization member ID',
			type: String,
		}),
		ApiResponse({
			status: HttpStatus.NO_CONTENT,
			description: 'Organization member removed successfully.',
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Organization member not found.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while removing organization member.',
		}),
	);
}
