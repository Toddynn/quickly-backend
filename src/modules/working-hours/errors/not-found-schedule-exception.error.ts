import { NotFoundException } from '@nestjs/common';

export class NotFoundScheduleExceptionException extends NotFoundException {
	constructor(fields: string) {
		super({ message: 'Horário especial não encontrado', fields });
	}
}
