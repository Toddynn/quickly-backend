import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { getPaginatedResponseSchema } from '@/shared/helpers/paginated-response-schema.helper';
import { ServiceCategoryDto } from '../../models/dto/output/service-category.dto';

export function ListServiceCategoriesDocs() {
	return applyDecorators(
		ApiOperation({ summary: 'List all service categories. Can be filtered by organization_id' }),
		ApiOkResponse({
			description: 'Service categories retrieved successfully',
			schema: getPaginatedResponseSchema(ServiceCategoryDto),
		}),
	);
}
