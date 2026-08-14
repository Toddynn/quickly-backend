import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { OrganizationMember } from '@/modules/organization-members/models/entities/organization-member.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';
import type { DayOfWeek } from '../../shared/enums/day-of-week.enum';

@Entity('professional_working_hours')
@Index(['professional_id', 'day_of_week'], { unique: true })
export class ProfessionalWorkingHours extends TimestampedEntity {
	@Column({ name: 'professional_id' })
	professional_id: string;

	@Column({ name: 'day_of_week', type: 'int' })
	day_of_week: DayOfWeek;

	@Column({ name: 'is_closed', type: 'boolean', default: false })
	is_closed: boolean;

	@Column({ name: 'start_time', type: 'time', nullable: true })
	start_time: string | null;

	@Column({ name: 'end_time', type: 'time', nullable: true })
	end_time: string | null;

	@ManyToOne(() => OrganizationMember)
	@JoinColumn({ name: 'professional_id' })
	professional: OrganizationMember;
}
