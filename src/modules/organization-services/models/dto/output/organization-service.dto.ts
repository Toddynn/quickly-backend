import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Organization } from '@/modules/organizations/models/entities/organization.entity';
import { ServiceCategory } from '@/modules/service-categories/models/entities/service-category.entity';
import { TimestampedEntityDto } from '@/shared/dto/timestamped-entity.dto';

export class OrganizationServiceDto extends TimestampedEntityDto {
	@ApiProperty({ description: 'The organization ID' })
	organization_id: string;

	@ApiProperty({ description: 'The name of the service' })
	name: string;

	@ApiPropertyOptional({ description: 'The description of the service' })
	description?: string;

	@ApiProperty({ description: 'The price of the service' })
	price: number;

	@ApiProperty({ description: 'The estimated duration of the service in minutes' })
	duration_minutes: number;

	@ApiPropertyOptional({ description: 'The service category ID' })
	service_category_id?: string;

	@ApiProperty({ description: 'Whether the service is active', default: true })
	active: boolean;

	@ApiProperty({ description: 'The organization', type: () => Organization })
	organization: Organization;

	@ApiPropertyOptional({ description: 'The service category', type: () => ServiceCategory })
	serviceCategory?: ServiceCategory;
}
