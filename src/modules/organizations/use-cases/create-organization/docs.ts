import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateOrganizationDto } from '../../models/dto/create-organization.dto';
import { Organization } from '../../models/entities/organization.entity';

export function CreateOrganizationDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Create a new organization',
			description:
				'Creates a new organization with name, description, logo and owner_id. The creator (owner_id) is automatically added as a member of the organization.',
		}),
		ApiBody({
			type: CreateOrganizationDto,
			description: 'Data for organization creation',
		}),
		ApiResponse({
			status: HttpStatus.CREATED,
			description: 'Organization created successfully.',
			type: Organization,
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
