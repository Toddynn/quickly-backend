import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateScheduleExceptionDto } from '../../models/dto/input/create-schedule-exception.dto';
import { ScheduleExceptionDto } from '../../models/dto/output/schedule-exception.dto';

export function CreateScheduleExceptionDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Create a schedule exception',
			description: 'Owner or the professional themselves. Covers vacations/time off (is_available: false) or extended hours (is_available: true).',
		}),
		ApiBody({ type: CreateScheduleExceptionDto }),
		ApiResponse({ status: HttpStatus.CREATED, description: 'Exception created.', type: ScheduleExceptionDto }),
		ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Only the owner or the professional themselves can set this schedule.' }),
		ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid date range or missing hours for an available exception.' }),
	);
}
