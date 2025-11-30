import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

export function ActivateOrganizationServiceDocs() {
	return applyDecorators(
		ApiOperation({ summary: 'Activate an organization service' }),
		ApiParam({ name: 'id', description: 'Organization service ID' }),
		ApiOkResponse({
			description: 'Organization service activated successfully',
		}),
	);
}
