import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Organization } from '@/modules/organizations/models/entities/organization.entity';
import { Plan } from '@/modules/plans/models/entities/plan.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';
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

	@Column({ name: 'abacate_customer_id', nullable: true })
	abacate_customer_id: string | null;

	@Index({ unique: true, where: 'abacate_subscription_id IS NOT NULL' })
	@Column({ name: 'abacate_subscription_id', nullable: true })
	abacate_subscription_id: string | null;

	@Column({ name: 'trial_ends_at', type: 'timestamp with time zone', nullable: true })
	trial_ends_at: Date | null;

	@Column({ name: 'current_period_end', type: 'timestamp with time zone', nullable: true })
	current_period_end: Date | null;

	@Column({ name: 'canceled_at', type: 'timestamp with time zone', nullable: true })
	canceled_at: Date | null;

	@ManyToOne(() => Organization)
	@JoinColumn({ name: 'organization_id' })
	organization: Organization;

	@ManyToOne(() => Plan)
	@JoinColumn({ name: 'plan_id' })
	plan: Plan;
}
