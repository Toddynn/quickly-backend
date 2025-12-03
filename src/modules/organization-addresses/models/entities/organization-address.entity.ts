import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Organization } from '@/modules/organizations/models/entities/organization.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';

@Entity('organization_addresses')
export class OrganizationAddress extends TimestampedEntity {
	@Column({ name: 'organization_id' })
	organization_id: string;

	@Column({ name: 'postal_code' })
	postal_code: string;

	@Column({ nullable: true, name: 'street' })
	street: string;

	@Column({ nullable: true, name: 'complement' })
	complement: string;

	@Column({ nullable: true, name: 'neighborhood' })
	neighborhood: string;

	@Column({ nullable: true, name: 'city' })
	city: string;

	@Column({ nullable: true, name: 'state', length: 2 })
	state: string;

	@Column({ nullable: true, name: 'ibge_code' })
	ibge_code: string;

	@Column({ nullable: true, name: 'gia_code' })
	gia_code: string;

	@Column({ nullable: true, name: 'ddd', length: 3 })
	ddd: string;

	@Column({ nullable: true, name: 'siafi_code' })
	siafi_code: string;

	@ManyToOne(() => Organization)
	@JoinColumn({ name: 'organization_id' })
	organization: Organization;
}
