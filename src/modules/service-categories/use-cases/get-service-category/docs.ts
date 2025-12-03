import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ServiceCategoryDto } from '../../models/dto/output/service-category.dto';

export function GetServiceCategoryDocs() {
	return applyDecorators(
		ApiOperation({ summary: 'Get a service category by ID' }),
		ApiParam({ name: 'id', description: 'Service category ID' }),
		ApiOkResponse({
			description: 'Service category found',
			type: ServiceCategoryDto,
		}),
	);
}
