import { NotFoundException } from '@nestjs/common';

export class NotFoundAppointmentException extends NotFoundException {
	constructor(fields: string) {
		super({ message: 'Agendamento não encontrado', fields });
	}
}
