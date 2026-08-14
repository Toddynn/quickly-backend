import { Inject, Injectable } from '@nestjs/common';
import type {
	OrganizationWorkingHoursRepositoryInterface,
	ProfessionalScheduleExceptionRepositoryInterface,
	ProfessionalWorkingHoursRepositoryInterface,
} from '../../models/interfaces/repository.interface';
import {
	ORGANIZATION_WORKING_HOURS_REPOSITORY_KEY,
	PROFESSIONAL_SCHEDULE_EXCEPTION_REPOSITORY_KEY,
	PROFESSIONAL_WORKING_HOURS_REPOSITORY_KEY,
} from '../../shared/constants/repository-interface-key';

export interface AvailabilityWindow {
	available: boolean;
	start_time: string | null;
	end_time: string | null;
}

@Injectable()
export class GetProfessionalAvailabilityWindowUseCase {
	constructor(
		@Inject(PROFESSIONAL_SCHEDULE_EXCEPTION_REPOSITORY_KEY)
		private readonly exceptionsRepository: ProfessionalScheduleExceptionRepositoryInterface,
		@Inject(PROFESSIONAL_WORKING_HOURS_REPOSITORY_KEY)
		private readonly professionalHoursRepository: ProfessionalWorkingHoursRepositoryInterface,
		@Inject(ORGANIZATION_WORKING_HOURS_REPOSITORY_KEY)
		private readonly organizationHoursRepository: OrganizationWorkingHoursRepositoryInterface,
	) {}

	async execute(professionalId: string, organizationId: string, date: string): Promise<AvailabilityWindow> {
		const unavailable: AvailabilityWindow = { available: false, start_time: null, end_time: null };

		const exception = await this.exceptionsRepository
			.createQueryBuilder('exception')
			.where('exception.professional_id = :professionalId', { professionalId })
			.andWhere('exception.start_date <= :date', { date })
			.andWhere('exception.end_date >= :date', { date })
			.getOne();

		if (exception) {
			if (!exception.is_available) return unavailable;
			return { available: true, start_time: exception.start_time, end_time: exception.end_time };
		}

		// Meio-dia evita qualquer ambiguidade de fuso na borda da meia-noite.
		const dayOfWeek = new Date(`${date}T12:00:00-03:00`).getDay();

		const professionalHours = await this.professionalHoursRepository.findOne({
			where: { professional_id: professionalId, day_of_week: dayOfWeek },
		});
		if (professionalHours) {
			if (professionalHours.is_closed) return unavailable;
			return { available: true, start_time: professionalHours.start_time, end_time: professionalHours.end_time };
		}

		const organizationHours = await this.organizationHoursRepository.findOne({
			where: { organization_id: organizationId, day_of_week: dayOfWeek },
		});
		if (!organizationHours || organizationHours.is_closed) return unavailable;

		return { available: true, start_time: organizationHours.start_time, end_time: organizationHours.end_time };
	}
}
