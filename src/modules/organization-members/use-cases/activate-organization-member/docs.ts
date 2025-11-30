import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function ActivateOrganizationMemberDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Activate an organization member',
			description: 'Activates an organization member, making them active again.',
		}),
		ApiParam({
			name: 'id',
			description: 'Organization member ID',
			type: String,
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Organization member activated successfully.',
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Organization member not found.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while activating organization member.',
		}),
	);
}
