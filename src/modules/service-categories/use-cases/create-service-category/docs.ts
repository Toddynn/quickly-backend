import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { ServiceCategory } from '../../models/entities/service-category.entity';

export function CreateServiceCategoryDocs() {
	return applyDecorators(
		ApiOperation({ summary: 'Create a new service category' }),
		ApiCreatedResponse({
			description: 'Service category created successfully',
			type: ServiceCategory,
		}),
	);
}
