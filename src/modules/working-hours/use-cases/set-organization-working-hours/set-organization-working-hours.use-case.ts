import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import type { SetWorkingHoursDto } from '../../models/dto/input/set-working-hours.dto';
import { OrganizationWorkingHours } from '../../models/entities/organization-working-hours.entity';

@Injectable()
export class SetOrganizationWorkingHoursUseCase {
	constructor(@Inject(DataSource) private readonly dataSource: DataSource) {}

	async execute(organizationId: string, dto: SetWorkingHoursDto): Promise<OrganizationWorkingHours[]> {
		return this.dataSource.transaction(async (manager) => {
			await manager.delete(OrganizationWorkingHours, { organization_id: organizationId });

			const rows = dto.days.map((day) =>
				manager.create(OrganizationWorkingHours, {
					organization_id: organizationId,
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
