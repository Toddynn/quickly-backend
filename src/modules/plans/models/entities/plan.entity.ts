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

	@Column({ name: 'max_professionals', type: 'int' })
	max_professionals: number;

	@Column({ name: 'max_services', type: 'int' })
	max_services: number;

	@Column({ name: 'max_customers', type: 'int' })
	max_customers: number;

	@Column({ name: 'integrations_limit', type: 'int', nullable: true })
	integrations_limit: number | null;

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

	// Preenchido de forma preguiçosa (lazy) na primeira troca de plano de uma organização —
	// a AbacatePay exige um Product cadastrado (com productId) só para o fluxo de change-plan,
	// diferente da criação de subscription, que aceita amount/name direto sem Product.
	@Column({ name: 'abacate_product_id', nullable: true })
	abacate_product_id: string | null;

	@Column({ name: 'active', type: 'boolean', default: true })
	active: boolean;
}
