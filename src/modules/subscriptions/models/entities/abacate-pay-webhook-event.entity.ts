import { Column, Entity, Index } from 'typeorm';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';

@Entity('abacate_pay_webhook_events')
// Idempotência: um evento (pelo `id` do payload da AbacatePay) só é processado uma vez, mesmo com retry de entrega.
@Index(['event_id'], { unique: true })
export class AbacatePayWebhookEvent extends TimestampedEntity {
	@Column({ name: 'event_id' })
	event_id: string;

	@Column({ name: 'event_type' })
	event_type: string;
}
