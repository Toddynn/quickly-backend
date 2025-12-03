import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Customer } from '@/modules/customer/models/entities/customer.entity';
import { OrganizationMember } from '@/modules/organization-members/models/entities/organization-member.entity';
import { OrganizationService } from '@/modules/organization-services/models/entities/organization-service.entity';
import { Organization } from '@/modules/organizations/models/entities/organization.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';
import { APPOINTMENT_STATUS } from '../../shared/interfaces/appointment-status';

@Entity('appointments')
@Index(['organization_id', 'professional_id', 'appointment_date'])
export class Appointment extends TimestampedEntity {
	@Column({ name: 'appointment_date', type: 'timestamp with time zone' })
	appointment_date: Date;

	@Column({ name: 'duration_minutes', type: 'int' })
	duration_minutes: number;

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	price: number;

	@Column({
		type: 'enum',
		enum: APPOINTMENT_STATUS,
		default: APPOINTMENT_STATUS.PENDING,
	})
	status: APPOINTMENT_STATUS;

	@Column({ name: 'organization_id' })
	organization_id: string;

	@Column({ name: 'professional_id' })
	professional_id: string;

	@Column({ name: 'customer_id' })
	customer_id: string;

	@Column({ name: 'organization_service_id' })
	organization_service_id: string;

	@ManyToOne(() => OrganizationMember)
	@JoinColumn({ name: 'professional_id' })
	professional: OrganizationMember;

	@ManyToOne(() => Customer)
	@JoinColumn({ name: 'customer_id' })
	customer: Customer;

	@ManyToOne(() => OrganizationService)
	@JoinColumn({ name: 'organization_service_id' })
	organization_service: OrganizationService;

	@ManyToOne(() => Organization)
	@JoinColumn({ name: 'organization_id' })
	organization: Organization;
}
