import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type { SessionUser } from '@/modules/auth/models/interfaces/session-user.interface';
import type { SetWorkingHoursDto } from '../../models/dto/input/set-working-hours.dto';
import { ProfessionalWorkingHours } from '../../models/entities/professional-working-hours.entity';
import { AssertOwnerOrSelfUseCase } from '../assert-owner-or-self/assert-owner-or-self.use-case';

@Injectable()
export class SetProfessionalWorkingHoursUseCase {
	constructor(
		@Inject(DataSource) private readonly dataSource: DataSource,
		@Inject(AssertOwnerOrSelfUseCase) private readonly assertOwnerOrSelfUseCase: AssertOwnerOrSelfUseCase,
	) {}

	async execute(
		professionalId: string,
		organizationId: string,
		dto: SetWorkingHoursDto,
		currentUser: SessionUser,
	): Promise<ProfessionalWorkingHours[]> {
		await this.assertOwnerOrSelfUseCase.execute(professionalId, organizationId, currentUser);

		return this.dataSource.transaction(async (manager) => {
			await manager.delete(ProfessionalWorkingHours, { professional_id: professionalId });

			const rows = dto.days.map((day) =>
				manager.create(ProfessionalWorkingHours, {
					professional_id: professionalId,
					day_of_week: day.day_of_week,
					is_closed: day.is_closed,
					start_time: day.is_closed ? null : day.start_time,
					end_time: day.is_closed ? null : day.end_time,
				}),
			);

			return manager.save(rows);
		});
	}
}
