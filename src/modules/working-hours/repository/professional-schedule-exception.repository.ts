import { Injectable } from '@nestjs/common';
import { type DataSource, Repository } from 'typeorm';
import { ProfessionalScheduleException } from '../models/entities/professional-schedule-exception.entity';
import type { ProfessionalScheduleExceptionRepositoryInterface } from '../models/interfaces/repository.interface';

@Injectable()
export class ProfessionalScheduleExceptionRepository extends Repository<ProfessionalScheduleException> implements ProfessionalScheduleExceptionRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(ProfessionalScheduleException, dataSource.createEntityManager());
	}
}
