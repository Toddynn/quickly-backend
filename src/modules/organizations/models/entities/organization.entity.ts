import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Customer } from '@/modules/customer/models/entities/customer.entity';
import { OrganizationAddress } from '@/modules/organization-addresses/models/entities/organization-address.entity';
import { OrganizationInvite } from '@/modules/organization-invites/models/entities/organization-invite.entity';
import { OrganizationMember } from '@/modules/organization-members/models/entities/organization-member.entity';
import { OrganizationService } from '@/modules/organization-services/models/entities/organization-service.entity';
import { ServiceCategory } from '@/modules/service-categories/models/entities/service-category.entity';
import { User } from '@/modules/users/models/entities/user.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';

@Entity('organizations')
export class Organization extends TimestampedEntity {
	@Column({
		unique: true,
		name: 'slug',
	})
	slug: string;

	@Column({ name: 'name' })
	name: string;

	@Column({ nullable: true, name: 'description' })
	description: string;

	@Column({ nullable: true, name: 'logo' })
	logo: string;

	@DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone' })
	deleted_at: Date;

	@Column({ name: 'owner_id' })
	owner_id: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'owner_id' })
	owner: User;

	@OneToMany(
		() => OrganizationMember,
		(organizationMember) => organizationMember.organization,
		{ onDelete: 'CASCADE' },
	)
	organization_members: OrganizationMember[];

	@OneToMany(
		() => OrganizationAddress,
		(organizationAddress) => organizationAddress.organization,
		{ onDelete: 'CASCADE' },
	)
	addresses: OrganizationAddress[];

	@OneToMany(
		() => OrganizationService,
		(organizationService) => organizationService.organization,
		{ onDelete: 'CASCADE' },
	)
	organization_services: OrganizationService[];

	@OneToMany(
		() => Customer,
		(customer) => customer.organization,
		{ onDelete: 'CASCADE' },
	)
	customers: Customer[];

	@OneToMany(
		() => ServiceCategory,
		(serviceCategory) => serviceCategory.organization,
		{ onDelete: 'CASCADE' },
	)
	service_categories: ServiceCategory[];

	@OneToMany(
		() => OrganizationInvite,
		(organizationInvite) => organizationInvite.organization,
		{ onDelete: 'CASCADE' },
	)
	invites: OrganizationInvite[];
}
