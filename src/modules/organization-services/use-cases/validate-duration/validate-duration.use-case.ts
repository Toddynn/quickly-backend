import { Injectable } from '@nestjs/common';
import { InvalidDurationException } from '../../errors/invalid-duration.error';
import { SCHEDULE_GRANULARITY_MINUTES } from '../../shared/constants/schedule-granularity';

@Injectable()
export class ValidateDurationUseCase {
	execute(durationMinutes: number): void {
		if (durationMinutes <= 0) {
			throw new InvalidDurationException();
		}

		if (durationMinutes % SCHEDULE_GRANULARITY_MINUTES !== 0) {
			throw new InvalidDurationException();
		}
	}
}
