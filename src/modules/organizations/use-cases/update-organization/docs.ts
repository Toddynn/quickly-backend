import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateOrganizationDto } from '../../models/dto/update-organization.dto';
import { Organization } from '../../models/entities/organization.entity';

export function UpdateOrganizationDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Update an organization',
			description: 'Updates the data of an existing organization.',
		}),
		ApiParam({
			name: 'id',
			description: 'Organization ID',
			type: String,
		}),
		ApiBody({
			type: UpdateOrganizationDto,
			description: 'Data for organization update',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Organization updated successfully.',
			type: Organization,
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Organization not found.',
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Invalid data for organization update.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while updating organization.',
		}),
	);
}
