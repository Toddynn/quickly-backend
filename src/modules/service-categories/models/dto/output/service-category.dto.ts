import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Organization } from '@/modules/organizations/models/entities/organization.entity';
import { TimestampedEntityDto } from '@/shared/dto/timestamped-entity.dto';

export class ServiceCategoryDto extends TimestampedEntityDto {
	@ApiProperty({ description: 'The name of the service category' })
	name: string;

	@ApiProperty({ description: 'The organization ID' })
	organization_id: string;

	@ApiPropertyOptional({ description: 'The description of the service category' })
	description?: string;

	@ApiProperty({ description: 'The organization', type: () => Organization })
	organization: Organization;
}
