import { ForbiddenException } from '@nestjs/common';

export class ForbiddenScheduleAccessException extends ForbiddenException {
	constructor() {
		super({ message: 'Você só pode gerenciar seu próprio horário' });
	}
}
