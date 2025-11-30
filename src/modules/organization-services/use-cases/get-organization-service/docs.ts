import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { OrganizationService } from '../../models/entities/organization-service.entity';

export function GetOrganizationServiceDocs() {
	return applyDecorators(
		ApiOperation({ summary: 'Get an organization service by ID' }),
		ApiParam({ name: 'id', description: 'Organization service ID' }),
		ApiOkResponse({
			description: 'Organization service found',
			type: OrganizationService,
		}),
	);
}
