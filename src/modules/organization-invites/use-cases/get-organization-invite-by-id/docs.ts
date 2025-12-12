import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { getExceptionResponseSchema } from '@/shared/helpers/exception-response-schema.helper';
import { NotFoundOrganizationInviteException } from '../../errors/not-found-organization-invite.error';
import { OrganizationInvite } from '../../models/entities/organization-invite.entity';

export function GetOrganizationInviteByIdDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Get an organization invite by ID',
			description: 'Retrieves an organization invite by its ID with related organization and inviter data.',
		}),
		ApiParam({
			name: 'id',
			description: 'The organization invite ID',
			type: String,
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Organization invite retrieved successfully.',
			type: OrganizationInvite,
		}),
		ApiResponse(getExceptionResponseSchema(NotFoundOrganizationInviteException, 'id=123', 'Organization invite not found.')),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while fetching organization invite.',
		}),
	);
}



