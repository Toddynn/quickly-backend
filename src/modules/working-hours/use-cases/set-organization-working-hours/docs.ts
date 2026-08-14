import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SetWorkingHoursDto } from '../../models/dto/input/set-working-hours.dto';
import { WorkingHoursDto } from '../../models/dto/output/working-hours.dto';

export function SetOrganizationWorkingHoursDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Set organization working hours',
			description: 'Owner-only. Replaces the full weekly schedule — days not included in the payload are treated as closed.',
		}),
		ApiBody({ type: SetWorkingHoursDto }),
		ApiResponse({ status: HttpStatus.OK, description: 'Working hours updated.', type: [WorkingHoursDto] }),
		ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Only the organization owner can set working hours.' }),
	);
}
