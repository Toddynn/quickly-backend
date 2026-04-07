import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { OrganizationRole } from '@/shared/constants/organization-roles';

export class SessionUserDto {
	@ApiProperty({ description: 'ID do usuário autenticado' })
	userId: string;

	@ApiProperty({ description: 'Email do usuário autenticado' })
	email: string;

	@ApiPropertyOptional({ description: 'ID da organização ativa' })
	activeOrganizationId: string | null;

	@ApiPropertyOptional({ description: 'Role na organização ativa' })
	organizationRole: OrganizationRole | null;
}
