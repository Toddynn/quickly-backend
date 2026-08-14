import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SetWorkingHoursDto } from '../../models/dto/input/set-working-hours.dto';
import { WorkingHoursDto } from '../../models/dto/output/working-hours.dto';

export function SetProfessionalWorkingHoursDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Set professional working hours',
			description: 'Owner or the professional themselves. Replaces the full weekly schedule — days not included in the payload are treated as closed.',
		}),
		ApiBody({ type: SetWorkingHoursDto }),
		ApiResponse({ status: HttpStatus.OK, description: 'Working hours updated.', type: [WorkingHoursDto] }),
		ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Only the owner or the professional themselves can set this schedule.' }),
	);
}
