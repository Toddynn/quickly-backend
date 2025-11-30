import { applyDecorators } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

export function DeleteServiceCategoryDocs() {
	return applyDecorators(
		ApiOperation({ summary: 'Delete a service category' }),
		ApiParam({ name: 'id', description: 'Service category ID' }),
		ApiNoContentResponse({
			description: 'Service category deleted successfully',
		}),
	);
}
