import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Organization } from '@/modules/organizations/models/entities/organization.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';
import type { DayOfWeek } from '../../shared/enums/day-of-week.enum';

@Entity('organization_working_hours')
// Um registro por dia da semana por organização — nunca duplicado.
@Index(['organization_id', 'day_of_week'], { unique: true })
export class OrganizationWorkingHours extends TimestampedEntity {
	@Column({ name: 'organization_id' })
	organization_id: string;

	@Column({ name: 'day_of_week', type: 'int' })
	day_of_week: DayOfWeek;

	@Column({ name: 'is_closed', type: 'boolean', default: false })
	is_closed: boolean;

	@Column({ name: 'start_time', type: 'time', nullable: true })
	start_time: string | null;

	@Column({ name: 'end_time', type: 'time', nullable: true })
	end_time: string | null;

	@ManyToOne(() => Organization)
	@JoinColumn({ name: 'organization_id' })
	organization: Organization;
}
