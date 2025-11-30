import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

export function InactivateOrganizationServiceDocs() {
	return applyDecorators(
		ApiOperation({ summary: 'Inactivate an organization service' }),
		ApiParam({ name: 'id', description: 'Organization service ID' }),
		ApiOkResponse({
			description: 'Organization service inactivated successfully',
		}),
	);
}
