import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Organization } from '@/modules/organizations/models/entities/organization.entity';
import { User } from '@/modules/users/models/entities/user.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';

@Entity('customers')
@Index(['organization_id', 'email'], { unique: true })
@Index(['organization_id', 'phone'])
export class Customer extends TimestampedEntity {
	@Column({ name: 'name' })
	name: string;

	@Column({ name: 'email', nullable: true })
	email?: string;

	@Column({ name: 'phone' })
	phone: string;

	@Column({ name: 'organization_id' })
	organization_id: string;

	@Column({ name: 'user_id', nullable: true })
	user_id: string | null;

	@ManyToOne(() => Organization)
	@JoinColumn({ name: 'organization_id' })
	organization: Organization;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User | null;
}
