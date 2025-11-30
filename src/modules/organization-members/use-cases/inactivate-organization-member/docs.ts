import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function InactivateOrganizationMemberDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Inactivate an organization member',
			description: 'Inactivates an organization member, keeping the appointment history intact.',
		}),
		ApiParam({
			name: 'id',
			description: 'Organization member ID',
			type: String,
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Organization member inactivated successfully.',
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Organization member not found.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while inactivating organization member.',
		}),
	);
}
