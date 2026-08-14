import { Inject, Injectable } from '@nestjs/common';
import type { SessionUser } from '@/modules/auth/models/interfaces/session-user.interface';
import type { CreateScheduleExceptionDto } from '../../models/dto/input/create-schedule-exception.dto';
import type { ProfessionalScheduleException } from '../../models/entities/professional-schedule-exception.entity';
import type { ProfessionalScheduleExceptionRepositoryInterface } from '../../models/interfaces/repository.interface';
import { InvalidWorkingHoursRangeException } from '../../errors/invalid-working-hours-range.error';
import { PROFESSIONAL_SCHEDULE_EXCEPTION_REPOSITORY_KEY } from '../../shared/constants/repository-interface-key';
import { AssertOwnerOrSelfUseCase } from '../assert-owner-or-self/assert-owner-or-self.use-case';

@Injectable()
export class CreateScheduleExceptionUseCase {
	constructor(
		@Inject(PROFESSIONAL_SCHEDULE_EXCEPTION_REPOSITORY_KEY)
		private readonly exceptionsRepository: ProfessionalScheduleExceptionRepositoryInterface,
		@Inject(AssertOwnerOrSelfUseCase)
		private readonly assertOwnerOrSelfUseCase: AssertOwnerOrSelfUseCase,
	) {}

	async execute(
		professionalId: string,
		organizationId: string,
		dto: CreateScheduleExceptionDto,
		currentUser: SessionUser,
	): Promise<ProfessionalScheduleException> {
		await this.assertOwnerOrSelfUseCase.execute(professionalId, organizationId, currentUser);

		if (dto.end_date < dto.start_date) {
			throw new InvalidWorkingHoursRangeException('A data final não pode ser anterior à data inicial');
		}
		if (dto.is_available && (!dto.start_time || !dto.end_time)) {
			throw new InvalidWorkingHoursRangeException('start_time e end_time são obrigatórios quando is_available é true');
		}

		const exception = this.exceptionsRepository.create({
			professional_id: professionalId,
			start_date: dto.start_date,
			end_date: dto.end_date,
			is_available: dto.is_available,
			start_time: dto.is_available ? dto.start_time : null,
			end_time: dto.is_available ? dto.end_time : null,
			reason: dto.reason ?? null,
		});

		return this.exceptionsRepository.save(exception);
	}
}
