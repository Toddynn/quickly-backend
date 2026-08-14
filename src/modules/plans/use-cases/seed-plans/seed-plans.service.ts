import { Inject, Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import type { PlansRepositoryInterface } from '../../models/interfaces/repository.interface';
import { PLAN_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { PlanKey } from '../../shared/enums/plan-key.enum';
import { SupportTier } from '../../shared/enums/support-tier.enum';

const PLAN_SEEDS = [
	{
		key: PlanKey.STARTER,
		name: 'Starter',
		price_cents: 2900,
		max_professionals: 1,
		max_services: 5,
		max_customers: 100,
		integrations_limit: 2,
		storage_limit_mb: 500,
		landing_page_templates_count: 1,
		inventory_enabled: false,
		inventory_max_skus: null,
		support_tier: SupportTier.EMAIL,
	},
	{
		key: PlanKey.PROFESSIONAL,
		name: 'Professional',
		price_cents: 7900,
		max_professionals: 10,
		max_services: 30,
		max_customers: 500,
		integrations_limit: 5,
		storage_limit_mb: 2048,
		landing_page_templates_count: 2,
		inventory_enabled: true,
		inventory_max_skus: 100,
		support_tier: SupportTier.EMAIL_CHAT,
	},
	{
		key: PlanKey.BUSINESS,
		name: 'Business',
		price_cents: 19900,
		max_professionals: 50,
		max_services: 100,
		max_customers: 2000,
		integrations_limit: null,
		storage_limit_mb: 5120,
		landing_page_templates_count: 3,
		inventory_enabled: true,
		inventory_max_skus: null,
		support_tier: SupportTier.PRIORITY_24H,
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
