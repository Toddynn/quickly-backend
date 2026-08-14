import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiExtraModels, ApiOperation, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { CreateOrganizationDto } from '../../models/dto/input/create-organization.dto';
import { OrganizationDto } from '../../models/dto/output/organization.dto';

export function CreateOrganizationDocs() {
	return applyDecorators(
		ApiExtraModels(OrganizationDto),
		ApiOperation({
			summary: 'Create a new organization',
			description:
				'Creates a new organization with name, description, logo and chosen plan. The authenticated user is automatically set as owner and added as a member of the organization. A 30-day trial subscription is created via AbacatePay, and a checkout URL is returned so the owner can register a card.',
		}),
		ApiBody({
			type: CreateOrganizationDto,
			description: 'Data for organization creation',
		}),
		ApiResponse({
			status: HttpStatus.CREATED,
			description: 'Organization created successfully, along with the AbacatePay checkout URL to complete card registration.',
			schema: {
				type: 'object',
				properties: {
					organization: { $ref: getSchemaPath(OrganizationDto) },
					checkoutUrl: { type: 'string' },
				},
			},
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Invalid data for organization creation.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while creating organization.',
		}),
	);
}
