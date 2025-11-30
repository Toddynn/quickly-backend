import { applyDecorators } from '@nestjs/common';
import { ApiNoContentResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

export function DeleteOrganizationServiceDocs() {
	return applyDecorators(
		ApiOperation({ summary: 'Delete an organization service' }),
		ApiParam({ name: 'id', description: 'Organization service ID' }),
		ApiNoContentResponse({
			description: 'Organization service deleted successfully',
		}),
	);
}
