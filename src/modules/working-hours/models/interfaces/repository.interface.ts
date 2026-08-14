import type { Repository } from 'typeorm';
import type { OrganizationWorkingHours } from '../entities/organization-working-hours.entity';
import type { ProfessionalScheduleException } from '../entities/professional-schedule-exception.entity';
import type { ProfessionalWorkingHours } from '../entities/professional-working-hours.entity';

export type OrganizationWorkingHoursRepositoryInterface = Repository<OrganizationWorkingHours>;
export type ProfessionalWorkingHoursRepositoryInterface = Repository<ProfessionalWorkingHours>;
export type ProfessionalScheduleExceptionRepositoryInterface = Repository<ProfessionalScheduleException>;
