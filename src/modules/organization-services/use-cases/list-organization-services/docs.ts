import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { getPaginatedResponseSchema } from '@/shared/helpers/paginated-response-schema.helper';
import { OrganizationService } from '../../models/entities/organization-service.entity';

export function ListOrganizationServicesDocs() {
	return applyDecorators(
		ApiOperation({ summary: 'List all organization services' }),
		ApiOkResponse({
			description: 'Organization services retrieved successfully',
			schema: getPaginatedResponseSchema(OrganizationService),
		}),
	);
}
