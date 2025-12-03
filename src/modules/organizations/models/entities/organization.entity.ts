import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '@/modules/users/models/entities/user.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';
import { OrganizationAddress } from '../../../organization-addresses/models/entities/organization-address.entity';
import { OrganizationMember } from '../../../organization-members/models/entities/organization-member.entity';

@Entity('organizations')
export class Organization extends TimestampedEntity {
	@Column({ name: 'name' })
	name: string;

	@Column({ nullable: true, name: 'description' })
	description: string;

	@Column({ nullable: true, name: 'logo' })
	logo: string;

	@Column({ name: 'owner_id' })
	owner_id: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'owner_id' })
	owner: User;

	@OneToMany(
		() => OrganizationMember,
		(organizationMember) => organizationMember.organization,
	)
	organizationMembers: OrganizationMember[];

	@OneToMany(
		() => OrganizationAddress,
		(organizationAddress) => organizationAddress.organization,
	)
	addresses: OrganizationAddress[];
}
