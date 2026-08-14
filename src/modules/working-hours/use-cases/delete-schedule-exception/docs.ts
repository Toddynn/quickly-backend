import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function DeleteScheduleExceptionDocs() {
	return applyDecorators(
		ApiOperation({ summary: 'Delete a schedule exception' }),
		ApiResponse({ status: HttpStatus.OK, description: 'Exception deleted.' }),
		ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Only the owner or the professional themselves can delete this exception.' }),
		ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Exception not found.' }),
	);
}
