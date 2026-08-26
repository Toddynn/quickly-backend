import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Organization } from '@/modules/organizations/models/entities/organization.entity';
import { Plan } from '@/modules/plans/models/entities/plan.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';
import { BillingCycle } from '../../shared/enums/billing-cycle.enum';
import { SubscriptionStatus } from '../../shared/enums/subscription-status.enum';

@Entity('subscriptions')
export class Subscription extends TimestampedEntity {
	@Column({ name: 'organization_id', unique: true })
	organization_id: string;

	@Column({ name: 'plan_id' })
	plan_id: string;

	@Column({
		name: 'status',
		type: 'enum',
		enum: SubscriptionStatus,
		enumName: 'subscription_status_enum',
		default: SubscriptionStatus.TRIALING,
	})
	status: SubscriptionStatus;

	// ANNUAL cobra à vista via Pix (checkout único) — abacate_subscription_id fica null
	// nesse caso, já que não existe subscription recorrente da AbacatePay pra cobrança anual.
	@Column({
		name: 'billing_cycle',
		type: 'enum',
		enum: BillingCycle,
		enumName: 'billing_cycle_enum',
		default: BillingCycle.MONTHLY,
	})
	billing_cycle: BillingCycle;

	@Column({ name: 'abacate_customer_id', nullable: true })
	abacate_customer_id: string | null;

	// bill_… — resposta de POST /subscriptions/create (checkout de assinatura, não a assinatura em si)
	@Index({ unique: true, where: 'abacate_checkout_id IS NOT NULL' })
	@Column({ name: 'abacate_checkout_id', nullable: true })
	abacate_checkout_id: string | null;

	// subs_… — só existe depois do webhook subscription.completed / trial_started
	@Index({ unique: true, where: 'abacate_subscription_id IS NOT NULL' })
	@Column({ name: 'abacate_subscription_id', nullable: true })
	abacate_subscription_id: string | null;

	@Column({ name: 'trial_ends_at', type: 'timestamp with time zone', nullable: true })
	trial_ends_at: Date | null;

	@Column({ name: 'current_period_end', type: 'timestamp with time zone', nullable: true })
	current_period_end: Date | null;

	// Menor threshold de lembrete já enviado (30/15/3) — evita reenviar o mesmo aviso todo dia
	// enquanto o cron roda. Resetado pra null sempre que a assinatura renova (ver handle-abacate-pay-webhook).
	@Column({ name: 'last_renewal_reminder_days_before', type: 'int', nullable: true })
	last_renewal_reminder_days_before: number | null;

	@Column({ name: 'canceled_at', type: 'timestamp with time zone', nullable: true })
	canceled_at: Date | null;

	@ManyToOne(() => Organization)
	@JoinColumn({ name: 'organization_id' })
	organization: Organization;

	@ManyToOne(() => Plan)
	@JoinColumn({ name: 'plan_id' })
	plan: Plan;
}
