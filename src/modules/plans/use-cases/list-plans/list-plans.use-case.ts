import { Inject, Injectable } from '@nestjs/common';
import { AppCacheService } from '@/shared/cache/app-cache.service';
import { APP_CACHE_KEYS } from '@/shared/cache/cache-key.constant';
import { APP_CACHE_TTL_SECONDS } from '@/shared/cache/cache-ttl.constant';
import type { Plan } from '../../models/entities/plan.entity';
import type { PlansRepositoryInterface } from '../../models/interfaces/repository.interface';
import { PLAN_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class ListPlansUseCase {
	constructor(
		@Inject(PLAN_REPOSITORY_INTERFACE_KEY)
		private readonly plansRepository: PlansRepositoryInterface,
		@Inject(AppCacheService)
		private readonly appCacheService: AppCacheService,
	) {}

	async execute(): Promise<Plan[]> {
		return this.appCacheService.getOrSet(APP_CACHE_KEYS.plansList, APP_CACHE_TTL_SECONDS.plansList, () =>
			this.plansRepository.find({ where: { active: true }, order: { price_cents: 'ASC' } }),
		);
	}
}
