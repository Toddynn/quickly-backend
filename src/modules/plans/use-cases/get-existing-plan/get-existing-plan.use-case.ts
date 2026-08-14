import { Inject, Injectable } from '@nestjs/common';
import type { FindOneOptions } from 'typeorm';
import { formatWhereClause } from '@/shared/helpers/format-where-clause.helper';
import { normalizeGetExistingOptions } from '@/shared/helpers/normalize-get-existing-options.helper';
import type { GetExistingOptions } from '@/shared/interfaces/get-existing-options';
import { NotFoundPlanException } from '../../errors/not-found-plan.error';
import type { Plan } from '../../models/entities/plan.entity';
import type { PlansRepositoryInterface } from '../../models/interfaces/repository.interface';
import { PLAN_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class GetExistingPlanUseCase {
	constructor(
		@Inject(PLAN_REPOSITORY_INTERFACE_KEY)
		private readonly plansRepository: PlansRepositoryInterface,
	) {}

	async execute(criteria: FindOneOptions<Plan>, options: GetExistingOptions = {}): Promise<Plan | null> {
		const { throwIfFound, throwIfNotFound } = normalizeGetExistingOptions(options);
		const fields = formatWhereClause(criteria.where || {});

		const plan = await this.plansRepository.findOne(criteria);

		if (!plan) {
			if (throwIfNotFound) throw new NotFoundPlanException(fields);
			return null;
		}

		if (throwIfFound) throw new NotFoundPlanException(fields);

		return plan;
	}
}
