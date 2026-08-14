import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ScheduleExceptionDto } from '../../models/dto/output/schedule-exception.dto';

export function ListScheduleExceptionsDocs() {
	return applyDecorators(
		ApiOperation({ summary: 'List schedule exceptions', description: 'Returns all exceptions for the professional, ordered by start date.' }),
		ApiResponse({ status: HttpStatus.OK, description: 'List of exceptions.', type: [ScheduleExceptionDto] }),
	);
}
