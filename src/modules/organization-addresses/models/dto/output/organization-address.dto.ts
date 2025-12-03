import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Organization } from '@/modules/organizations/models/entities/organization.entity';
import { TimestampedEntityDto } from '@/shared/dto/timestamped-entity.dto';

export class OrganizationAddressDto extends TimestampedEntityDto {
	@ApiProperty({ description: 'The organization ID' })
	organization_id: string;

	@ApiProperty({ description: 'The postal code (CEP)' })
	postal_code: string;

	@ApiPropertyOptional({ description: 'The street name (logradouro)' })
	street?: string;

	@ApiPropertyOptional({ description: 'The address complement (complemento)' })
	complement?: string;

	@ApiPropertyOptional({ description: 'The neighborhood (bairro)' })
	neighborhood?: string;

	@ApiPropertyOptional({ description: 'The city (localidade)' })
	city?: string;

	@ApiPropertyOptional({ description: 'The state (UF)' })
	state?: string;

	@ApiPropertyOptional({ description: 'The IBGE code of the municipality' })
	ibge_code?: string;

	@ApiPropertyOptional({ description: 'The GIA code (used in São Paulo state)' })
	gia_code?: string;

	@ApiPropertyOptional({ description: 'The area code (DDD)' })
	ddd?: string;

	@ApiPropertyOptional({ description: 'The SIAFI code of the municipality' })
	siafi_code?: string;

	@ApiProperty({ description: 'The organization', type: () => Organization })
	organization: Organization;
}

