import { BadRequestException } from '@nestjs/common';

export class InvalidWorkingHoursRangeException extends BadRequestException {
	constructor(message: string) {
		super({ message });
	}
}
