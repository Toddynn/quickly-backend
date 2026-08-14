import { NotFoundException } from '@nestjs/common';

export class NotFoundScheduleExceptionException extends NotFoundException {
	constructor(fields: string) {
		super({ message: 'Exceção de horário não encontrada', fields });
	}
}
