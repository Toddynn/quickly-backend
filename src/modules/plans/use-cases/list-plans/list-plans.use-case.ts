import { Inject, Injectable } from '@nestjs/common';
import type { Plan } from '../../models/entities/plan.entity';
import type { PlansRepositoryInterface } from '../../models/interfaces/repository.interface';
import { PLAN_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class ListPlansUseCase {
	constructor(
		@Inject(PLAN_REPOSITORY_INTERFACE_KEY)
		private readonly plansRepository: PlansRepositoryInterface,
	) {}

	async execute(): Promise<Plan[]> {
		return this.plansRepository.find({ where: { active: true }, order: { price_cents: 'ASC' } });
	}
}
