import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateOrganizationMemberDto } from '../../models/dto/create-organization-member.dto';
import { OrganizationMember } from '../../models/entities/organization-member.entity';

export function CreateOrganizationMemberDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Create a new organization member',
			description: 'Links a user to an organization as a member.',
		}),
		ApiBody({
			type: CreateOrganizationMemberDto,
			description: 'Data for organization member creation',
		}),
		ApiResponse({
			status: HttpStatus.CREATED,
			description: 'Organization member created successfully.',
			type: OrganizationMember,
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Invalid data for organization member creation.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while creating organization member.',
		}),
	);
}
