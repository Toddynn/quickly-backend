import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { getPaginatedResponseSchema } from '@/shared/helpers/paginated-response-schema.helper';
import { OrganizationInvite } from '../../models/entities/organization-invite.entity';

export function ListOrganizationInvitesByOrganizationDocs() {
	return applyDecorators(
		ApiExtraModels(OrganizationInvite),
		ApiOperation({
			summary: 'List organization invites by organization',
			description: 'Returns a paginated list with all invites for a specific organization. Used by organization clients.',
		}),
		ApiParam({
			name: 'organization_id',
			description: 'Organization ID',
			type: String,
		}),
		ApiQuery({
			name: 'page',
			required: false,
			type: Number,
			description: 'Page number (default: 1)',
		}),
		ApiQuery({
			name: 'limit',
			required: false,
			type: Number,
			description: 'Number of items per page (default: 10)',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'List of invites returned successfully.',
			schema: getPaginatedResponseSchema(OrganizationInvite),
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while listing invites.',
		}),
	);
}
