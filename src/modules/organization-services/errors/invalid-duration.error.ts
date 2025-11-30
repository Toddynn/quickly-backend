import { BadRequestException } from '@nestjs/common';
import { SCHEDULE_GRANULARITY_MINUTES } from '../shared/constants/schedule-granularity';

export class InvalidDurationException extends BadRequestException {
	constructor() {
		super(`A duração estimada deve ser um múltiplo de ${SCHEDULE_GRANULARITY_MINUTES} minutos e maior que zero.`);
		this.name = 'InvalidDurationException';
	}
}
