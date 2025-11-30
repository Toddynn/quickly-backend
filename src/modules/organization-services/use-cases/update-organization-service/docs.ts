import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

export function UpdateOrganizationServiceDocs() {
	return applyDecorators(
		ApiOperation({ summary: 'Update an organization service' }),
		ApiParam({ name: 'id', description: 'Organization service ID' }),
		ApiOkResponse({
			description: 'Organization service updated successfully',
		}),
	);
}
