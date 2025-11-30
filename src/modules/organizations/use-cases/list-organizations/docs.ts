import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { getPaginatedResponseSchema } from '@/shared/helpers/paginated-response-schema.helper';
import { Organization } from '../../models/entities/organization.entity';

export function ListOrganizationsDocs() {
	return applyDecorators(
		ApiExtraModels(Organization),
		ApiOperation({
			summary: 'List all organizations',
			description: 'Returns a paginated list with all registered organizations.',
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
			description: 'List of organizations returned successfully.',
			schema: getPaginatedResponseSchema(Organization),
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while listing organizations.',
		}),
	);
}
