import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { getExceptionResponseSchema } from '@/shared/helpers/exception-response-schema.helper';
import { UnableToDeleteOrganizationException } from '../../errors/unable-to-delete-organization.error';

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
		ApiForbiddenResponse(
			getExceptionResponseSchema(UnableToDeleteOrganizationException, [], { description: 'Somente o dono da organização pode excluí-la.' }),
		),
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
