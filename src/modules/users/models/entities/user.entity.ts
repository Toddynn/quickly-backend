import { Column, Entity, OneToMany } from 'typeorm';
import { OrganizationMember } from '@/modules/organization-members/models/entities/organization-member.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';

@Entity('users')
export class User extends TimestampedEntity {
	@Column({ name: 'name' })
	name: string;

	@Column({ name: 'email', unique: true })
	email: string;

	@Column({ select: false, name: 'password' })
	password: string;

	@Column({ name: 'phone', nullable: true })
	phone?: string;

	@Column({ name: 'email_verified', type: 'boolean', default: false })
	email_verified: boolean;

	@OneToMany(
		() => OrganizationMember,
		(organizationMember) => organizationMember.user,
		{ onDelete: 'CASCADE' },
	)
	organization_memberships: OrganizationMember[];
}
