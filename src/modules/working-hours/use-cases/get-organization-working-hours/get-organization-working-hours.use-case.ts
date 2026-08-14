import { Inject, Injectable } from '@nestjs/common';
import { DayOfWeek } from '../../shared/enums/day-of-week.enum';
import type { WorkingHoursDto } from '../../models/dto/output/working-hours.dto';
import type { OrganizationWorkingHoursRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_WORKING_HOURS_REPOSITORY_KEY } from '../../shared/constants/repository-interface-key';

const ALL_DAYS = [
	DayOfWeek.SUNDAY,
	DayOfWeek.MONDAY,
	DayOfWeek.TUESDAY,
	DayOfWeek.WEDNESDAY,
	DayOfWeek.THURSDAY,
	DayOfWeek.FRIDAY,
	DayOfWeek.SATURDAY,
];

@Injectable()
export class GetOrganizationWorkingHoursUseCase {
	constructor(
		@Inject(ORGANIZATION_WORKING_HOURS_REPOSITORY_KEY)
		private readonly organizationWorkingHoursRepository: OrganizationWorkingHoursRepositoryInterface,
	) {}

	async execute(organizationId: string): Promise<WorkingHoursDto[]> {
		const rows = await this.organizationWorkingHoursRepository.find({ where: { organization_id: organizationId } });
		const byDay = new Map(rows.map((row) => [row.day_of_week, row]));

		return ALL_DAYS.map((day_of_week) => {
			const row = byDay.get(day_of_week);
			return row
				? { day_of_week, is_closed: row.is_closed, start_time: row.start_time, end_time: row.end_time }
				: { day_of_week, is_closed: true, start_time: null, end_time: null };
		});
	}
}
