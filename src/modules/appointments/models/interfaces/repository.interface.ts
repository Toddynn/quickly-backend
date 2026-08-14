import type { Repository } from 'typeorm';
import type { Appointment } from '../entities/appointments.entity';

export type AppointmentsRepositoryInterface = Repository<Appointment>;
