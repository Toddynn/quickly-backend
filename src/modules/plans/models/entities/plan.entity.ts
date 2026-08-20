import { Column, Entity } from 'typeorm';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';
import { PlanKey } from '../../shared/enums/plan-key.enum';
import { SupportTier } from '../../shared/enums/support-tier.enum';

@Entity('plans')
export class Plan extends TimestampedEntity {
	@Column({ name: 'key', type: 'enum', enum: PlanKey, enumName: 'plan_key_enum', unique: true })
	key: PlanKey;

	@Column({ name: 'name' })
	name: string;

	@Column({ name: 'price_cents', type: 'int' })
	price_cents: number;

	// Cobrado à vista via Pix (checkout único, não subscription recorrente da AbacatePay).
	@Column({ name: 'annual_price_cents', type: 'int' })
	annual_price_cents: number;

	// null = sem limite (plano Estúdio).
	@Column({ name: 'max_professionals', type: 'int', nullable: true })
	max_professionals: number | null;

	@Column({ name: 'max_services', type: 'int' })
	max_services: number;

	@Column({ name: 'storage_limit_mb', type: 'int' })
	storage_limit_mb: number;

	@Column({ name: 'landing_page_templates_count', type: 'int' })
	landing_page_templates_count: number;

	@Column({ name: 'inventory_enabled', type: 'boolean', default: false })
	inventory_enabled: boolean;

	@Column({ name: 'inventory_max_skus', type: 'int', nullable: true })
	inventory_max_skus: number | null;

	@Column({ name: 'support_tier', type: 'enum', enum: SupportTier, enumName: 'support_tier_enum' })
	support_tier: SupportTier;

	// Products criados manualmente na AbacatePay antes do boot (nunca em runtime) —
	// ids vêm de env (ver ABACATE_PAY_PLAN_*_PRODUCT_ID / *_ANNUAL_PRODUCT_ID) e são gravados pelo SeedPlansService.
	// mensal: cycle MONTHLY, usado na subscription recorrente de cartão.
	@Column({ name: 'abacate_product_id' })
	abacate_product_id: string;

	// anual: produto avulso (sem cycle), usado só como item de checkout único via Pix — nunca em subscription.
	@Column({ name: 'abacate_annual_product_id' })
	abacate_annual_product_id: string;

	@Column({ name: 'active', type: 'boolean', default: true })
	active: boolean;
}
