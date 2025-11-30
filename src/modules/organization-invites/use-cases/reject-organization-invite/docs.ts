import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function RejectOrganizationInviteDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Reject an organization invite',
			description: 'Rejects a pending invite, updating the status to REJECTED.',
		}),
		ApiParam({
			name: 'id',
			description: 'Unique invite ID (UUID)',
			type: String,
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Invite rejected successfully.',
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Invite is no longer pending.',
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Invite not found.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while rejecting invite.',
		}),
	);
}
