import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TimestampedEntityDto } from '@/shared/dto/timestamped-entity.dto';

export class ActiveOrganizationSummaryDto extends TimestampedEntityDto {
	@ApiProperty({ description: 'Slug público da organização (tenant)' })
	slug: string;

	@ApiProperty({ description: 'Nome da organização' })
	name: string;

	@ApiPropertyOptional({ description: 'Descrição da organização' })
	description?: string;

	@ApiPropertyOptional({ description: 'Caminho ou URL do logo' })
	logo?: string;

	@ApiProperty({ description: 'ID do usuário proprietário da organização' })
	owner_id: string;
}
