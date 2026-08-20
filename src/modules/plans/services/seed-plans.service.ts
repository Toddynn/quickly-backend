import { Inject, Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { env } from '@/shared/constants/env-variables';
import type { PlansRepositoryInterface } from '../models/interfaces/repository.interface';
import { PLAN_REPOSITORY_INTERFACE_KEY } from '../shared/constants/repository-interface-key';
import { PlanKey } from '../shared/enums/plan-key.enum';
import { SupportTier } from '../shared/enums/support-tier.enum';

const PLAN_SEEDS = [
	{
		key: PlanKey.SOLO,
		name: 'Solo',
		price_cents: 3990,
		annual_price_cents: 39900,
		max_professionals: 1,
		max_services: 10,
		storage_limit_mb: 500,
		landing_page_templates_count: 1,
		inventory_enabled: false,
		inventory_max_skus: null,
		support_tier: SupportTier.EMAIL,
		abacate_product_id: env.ABACATE_PAY_PLAN_SOLO_PRODUCT_ID,
		abacate_annual_product_id: env.ABACATE_PAY_PLAN_SOLO_ANNUAL_PRODUCT_ID,
	},
	{
		key: PlanKey.TEAM,
		name: 'Equipe',
		price_cents: 8490,
		annual_price_cents: 84900,
		max_professionals: 4,
		max_services: 40,
		storage_limit_mb: 2048,
		landing_page_templates_count: 2,
		inventory_enabled: true,
		inventory_max_skus: 150,
		support_tier: SupportTier.EMAIL_CHAT,
		abacate_product_id: env.ABACATE_PAY_PLAN_TEAM_PRODUCT_ID,
		abacate_annual_product_id: env.ABACATE_PAY_PLAN_TEAM_ANNUAL_PRODUCT_ID,
	},
	{
		key: PlanKey.STUDIO,
		name: 'Estúdio',
		price_cents: 11990,
		annual_price_cents: 119900,
		max_professionals: null,
		max_services: 100,
		storage_limit_mb: 5120,
		landing_page_templates_count: 3,
		inventory_enabled: true,
		inventory_max_skus: null,
		support_tier: SupportTier.PRIORITY_24H,
		abacate_product_id: env.ABACATE_PAY_PLAN_STUDIO_PRODUCT_ID,
		abacate_annual_product_id: env.ABACATE_PAY_PLAN_STUDIO_ANNUAL_PRODUCT_ID,
	},
];

@Injectable()
export class SeedPlansService implements OnModuleInit {
	private readonly logger = new Logger(SeedPlansService.name);

	constructor(
		@Inject(PLAN_REPOSITORY_INTERFACE_KEY)
		private readonly plansRepository: PlansRepositoryInterface,
	) {}

	async onModuleInit(): Promise<void> {
		for (const seed of PLAN_SEEDS) {
			const existing = await this.plansRepository.findOne({ where: { key: seed.key } });
			if (existing) continue;
			const plan = this.plansRepository.create(seed);
			await this.plansRepository.save(plan);
			this.logger.log(`Seeded plan ${seed.key}`);
		}
	}
}
