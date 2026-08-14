import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAppointmentDto } from '../../models/dto/input/create-appointment.dto';

export function CreateAppointmentDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Create an appointment',
			description:
				'appointment_date should be an exact slot returned by GET /appointments/available-slots. Server re-validates working hours and overlap regardless — never trust a client-computed slot.',
		}),
		ApiBody({ type: CreateAppointmentDto }),
		ApiResponse({ status: HttpStatus.CREATED, description: 'Appointment created with status PENDING.' }),
		ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Requested time falls outside the professional working hours.' }),
		ApiResponse({ status: HttpStatus.CONFLICT, description: 'The professional already has an appointment overlapping this time.' }),
	);
}
