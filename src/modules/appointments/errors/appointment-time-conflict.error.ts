import { ConflictException } from '@nestjs/common';

export class AppointmentTimeConflictException extends ConflictException {
	constructor() {
		super({ message: 'Esse profissional já tem um agendamento nesse horário' });
	}
}
