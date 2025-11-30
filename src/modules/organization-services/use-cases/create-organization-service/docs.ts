import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { OrganizationService } from '../../models/entities/organization-service.entity';

export function CreateOrganizationServiceDocs() {
	return applyDecorators(
		ApiOperation({ summary: 'Create a new organization service' }),
		ApiCreatedResponse({
			description: 'Organization service created successfully',
			type: OrganizationService,
		}),
	);
}
