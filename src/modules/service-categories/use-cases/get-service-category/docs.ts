import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ServiceCategory } from '../../models/entities/service-category.entity';

export function GetServiceCategoryDocs() {
	return applyDecorators(
		ApiOperation({ summary: 'Get a service category by ID' }),
		ApiParam({ name: 'id', description: 'Service category ID' }),
		ApiOkResponse({
			description: 'Service category found',
			type: ServiceCategory,
		}),
	);
}
