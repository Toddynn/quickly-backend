import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function GetAppointmentDocs() {
	return applyDecorators(
		ApiOperation({ summary: 'Get an appointment by id' }),
		ApiResponse({ status: HttpStatus.OK, description: 'Appointment found.' }),
		ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Appointment not found in this organization.' }),
	);
}
