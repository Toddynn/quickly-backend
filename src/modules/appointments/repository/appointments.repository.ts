import { Injectable } from '@nestjs/common';
import { type DataSource, Repository } from 'typeorm';
import { Appointment } from '../models/entities/appointments.entity';
import type { AppointmentsRepositoryInterface } from '../models/interfaces/repository.interface';

@Injectable()
export class AppointmentsRepository extends Repository<Appointment> implements AppointmentsRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(Appointment, dataSource.createEntityManager());
	}
}
