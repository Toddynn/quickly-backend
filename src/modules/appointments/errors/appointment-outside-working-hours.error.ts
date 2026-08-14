import { BadRequestException } from '@nestjs/common';

export class AppointmentOutsideWorkingHoursException extends BadRequestException {
	constructor() {
		super({ message: 'Esse horário está fora do expediente do profissional' });
	}
}
