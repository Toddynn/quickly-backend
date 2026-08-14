import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

export function GetAvailableSlotsDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Get available appointment slots',
			description:
				'Returns the exact list of bookable start/end times for a professional, service and date — already accounting for working hours, exceptions, and existing appointments. The frontend should not compute this itself.',
		}),
		ApiQuery({ name: 'date', example: '2026-08-20' }),
		ApiQuery({ name: 'professional_id' }),
		ApiQuery({ name: 'organization_service_id' }),
		ApiResponse({ status: HttpStatus.OK, description: 'List of available slots (empty array if none).' }),
	);
}
