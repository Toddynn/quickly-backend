import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function DeleteOrganizationAddressDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Delete an organization address',
			description: 'Deletes an existing organization address by its ID.',
		}),
		ApiParam({
			name: 'id',
			description: 'Organization address ID',
			type: String,
		}),
		ApiResponse({
			status: HttpStatus.NO_CONTENT,
			description: 'Organization address deleted successfully.',
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Organization address not found.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while deleting organization address.',
		}),
	);
}

