import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { OrganizationMember } from '@/modules/organization-members/models/entities/organization-member.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';

@Entity('professional_schedule_exceptions')
// Acelera a busca "existe exceção pra esse profissional nessa data?"
@Index(['professional_id', 'start_date', 'end_date'])
export class ProfessionalScheduleException extends TimestampedEntity {
	@Column({ name: 'professional_id' })
	professional_id: string;

	@Column({ name: 'start_date', type: 'date' })
	start_date: string;

	@Column({ name: 'end_date', type: 'date' })
	end_date: string;

	// false = folga/férias (bloqueia o período inteiro). true = disponível com horário próprio (start_time/end_time).
	@Column({ name: 'is_available', type: 'boolean' })
	is_available: boolean;

	@Column({ name: 'start_time', type: 'time', nullable: true })
	start_time: string | null;

	@Column({ name: 'end_time', type: 'time', nullable: true })
	end_time: string | null;

	@Column({ name: 'reason', nullable: true })
	reason: string | null;

	@ManyToOne(() => OrganizationMember)
	@JoinColumn({ name: 'professional_id' })
	professional: OrganizationMember;
}
