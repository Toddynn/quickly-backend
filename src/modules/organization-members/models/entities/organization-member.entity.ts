import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '@/modules/users/models/entities/user.entity';
import { OrganizationRole } from '@/shared/constants/organization-roles';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';
import { Organization } from '../../../organizations/models/entities/organization.entity';

@Entity('organization_members')
// Acelera filtros de listagem de membros por organização e status.
@Index(['organization_id', 'active'])
// Acelera resolução de memberships ativas por usuário durante auth/switch-context.
@Index(['user_id', 'active'])
// Garante que um usuário tenha no máximo um vínculo por organização (ativo ou inativo).
@Index(['organization_id', 'user_id'], { unique: true })
export class OrganizationMember extends TimestampedEntity {
	@Column({ name: 'active', type: 'boolean', default: true })
	active: boolean;

	@Column({
		name: 'role',
		type: 'enum',
		enum: OrganizationRole,
		enumName: 'organization_role_enum',
		default: OrganizationRole.PROFESSIONAL,
	})
	role: OrganizationRole;

	@Column({ name: 'organization_id' })
	organization_id: string;

	@Column({ name: 'user_id' })
	user_id: string;

	@ManyToOne(() => Organization)
	@JoinColumn({ name: 'organization_id' })
	organization: Organization;

	@ManyToOne(() => User)
	@JoinColumn({ name: 'user_id' })
	user: User;
}
