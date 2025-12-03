import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { ServiceCategoryDto } from '../../models/dto/output/service-category.dto';

export function CreateServiceCategoryDocs() {
	return applyDecorators(
		ApiOperation({ summary: 'Create a new service category' }),
		ApiCreatedResponse({
			description: 'Service category created successfully',
			type: ServiceCategoryDto,
		}),
	);
}
