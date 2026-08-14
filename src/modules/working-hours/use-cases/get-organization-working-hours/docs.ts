import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WorkingHoursDto } from '../../models/dto/output/working-hours.dto';

export function GetOrganizationWorkingHoursDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Get organization working hours',
			description: 'Always returns all 7 days — days without a saved row come back as is_closed: true.',
		}),
		ApiResponse({ status: HttpStatus.OK, description: 'Weekly schedule.', type: [WorkingHoursDto] }),
	);
}
