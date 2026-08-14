import { Inject, Injectable } from '@nestjs/common';
import type { SessionUser } from '@/modules/auth/models/interfaces/session-user.interface';
import { NotFoundScheduleExceptionException } from '../../errors/not-found-schedule-exception.error';
import type { ProfessionalScheduleExceptionRepositoryInterface } from '../../models/interfaces/repository.interface';
import { PROFESSIONAL_SCHEDULE_EXCEPTION_REPOSITORY_KEY } from '../../shared/constants/repository-interface-key';
import { AssertOwnerOrSelfUseCase } from '../assert-owner-or-self/assert-owner-or-self.use-case';

@Injectable()
export class DeleteScheduleExceptionUseCase {
	constructor(
		@Inject(PROFESSIONAL_SCHEDULE_EXCEPTION_REPOSITORY_KEY)
		private readonly exceptionsRepository: ProfessionalScheduleExceptionRepositoryInterface,
		@Inject(AssertOwnerOrSelfUseCase)
		private readonly assertOwnerOrSelfUseCase: AssertOwnerOrSelfUseCase,
	) {}

	async execute(exceptionId: string, organizationId: string, currentUser: SessionUser): Promise<void> {
		const exception = await this.exceptionsRepository.findOne({ where: { id: exceptionId } });
		if (!exception) throw new NotFoundScheduleExceptionException(`id=${exceptionId}`);

		await this.assertOwnerOrSelfUseCase.execute(exception.professional_id, organizationId, currentUser);

		await this.exceptionsRepository.delete({ id: exceptionId });
	}
}
