import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

export function UpdateServiceCategoryDocs() {
	return applyDecorators(
		ApiOperation({ summary: 'Update a service category' }),
		ApiParam({ name: 'id', description: 'Service category ID' }),
		ApiOkResponse({
			description: 'Service category updated successfully',
		}),
	);
}
