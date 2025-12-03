import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { getPaginatedResponseSchema } from '@/shared/helpers/paginated-response-schema.helper';
import { OrganizationAddress } from '../../models/entities/organization-address.entity';

export function ListOrganizationAddressesDocs() {
	return applyDecorators(
		ApiExtraModels(OrganizationAddress),
		ApiOperation({
			summary: 'List all organization addresses',
			description: 'Returns a paginated list with all registered organization addresses. Can be filtered by organization_id.',
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
		ApiQuery({
			name: 'organization_id',
			required: false,
			type: String,
			description: 'Filter by organization ID',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'List of organization addresses returned successfully.',
			schema: getPaginatedResponseSchema(OrganizationAddress),
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while listing organization addresses.',
		}),
	);
}

