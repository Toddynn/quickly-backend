import { Injectable } from '@nestjs/common';
import { type DataSource, Repository } from 'typeorm';
import { ProfessionalWorkingHours } from '../models/entities/professional-working-hours.entity';
import type { ProfessionalWorkingHoursRepositoryInterface } from '../models/interfaces/repository.interface';

@Injectable()
export class ProfessionalWorkingHoursRepository extends Repository<ProfessionalWorkingHours> implements ProfessionalWorkingHoursRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(ProfessionalWorkingHours, dataSource.createEntityManager());
	}
}
