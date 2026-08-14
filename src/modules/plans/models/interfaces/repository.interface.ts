import type { Repository } from 'typeorm';
import type { Plan } from '../entities/plan.entity';

export type PlansRepositoryInterface = Repository<Plan>;
