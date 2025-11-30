import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function CancelOrganizationInviteDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Cancel an organization invite',
			description: 'Cancels a pending invite, making the link invalid.',
		}),
		ApiParam({
			name: 'id',
			description: 'Invite ID',
			type: String,
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Invite canceled successfully.',
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Only pending invites can be canceled.',
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Invite not found.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while canceling invite.',
		}),
	);
}
