import { Inject, Injectable } from '@nestjs/common';
import type { ProfessionalScheduleException } from '../../models/entities/professional-schedule-exception.entity';
import type { ProfessionalScheduleExceptionRepositoryInterface } from '../../models/interfaces/repository.interface';
import { PROFESSIONAL_SCHEDULE_EXCEPTION_REPOSITORY_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class ListScheduleExceptionsUseCase {
	constructor(
		@Inject(PROFESSIONAL_SCHEDULE_EXCEPTION_REPOSITORY_KEY)
		private readonly exceptionsRepository: ProfessionalScheduleExceptionRepositoryInterface,
	) {}

	async execute(professionalId: string): Promise<ProfessionalScheduleException[]> {
		return this.exceptionsRepository.find({ where: { professional_id: professionalId }, order: { start_date: 'ASC' } });
	}
}
