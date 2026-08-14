import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ListAppointmentsDocs() {
	return applyDecorators(
		ApiOperation({ summary: 'List appointments', description: 'Paginated, filterable by professional, customer, status and date range. Ordered by appointment_date ASC.' }),
		ApiResponse({ status: HttpStatus.OK, description: 'Paginated list of appointments.' }),
	);
}
