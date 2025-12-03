import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CheckSlugAvailabilityResponseDto } from '../../models/dto/output/check-slug-availability-response.dto';

export function CheckSlugAvailabilityDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Check slug availability',
			description: 'Checks if a slug is available for use. ',
		}),
		ApiParam({
			name: 'slug',
			required: true,
			type: String,
			description: 'custom slug to check',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Slug availability checked successfully.',
			type: CheckSlugAvailabilityResponseDto,
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Invalid slug format provided.',
		}),
	);
}
