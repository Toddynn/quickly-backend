import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '@/modules/users/models/entities/user.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';
import { OrganizationMember } from '../../../organization-members/models/entities/organization-member.entity';

@Entity('organizations')
export class Organization extends TimestampedEntity {
	@Column({ name: 'name' })
	@ApiProperty({ description: 'The name of the organization' })
	name: string;

	@Column({ nullable: true, name: 'description' })
	@ApiProperty({ description: 'The description of the organization' })
	description: string;

	@Column({ nullable: true, name: 'logo' })
	@ApiProperty({ description: 'The logo path of the organization' })
	logo: string;

	@Column({ name: 'owner_id' })
	@ApiProperty({ description: 'The owner user ID of the organization' })
	owner_id: string;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'owner_id' })
	@ApiProperty({ description: 'The owner user of the organization', type: () => User })
	owner: User;

	@OneToMany(
		() => OrganizationMember,
		(organizationMember) => organizationMember.organization,
	)
	@ApiProperty({
		description: 'The members of the organization',
		type: () => [OrganizationMember],
	})
	organizationMembers: OrganizationMember[];
}
