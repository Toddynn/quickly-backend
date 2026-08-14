import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function TransitionAppointmentStatusDocs(action: 'confirm' | 'complete' | 'cancel' | 'no-show') {
	return applyDecorators(
		ApiOperation({ summary: `${action} an appointment` }),
		ApiResponse({ status: HttpStatus.OK, description: 'Status updated.' }),
		ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid status transition for the appointment current state.' }),
		ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Appointment not found in this organization.' }),
	);
}
