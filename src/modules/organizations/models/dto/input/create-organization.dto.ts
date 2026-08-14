import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { IsOrganizationSlug } from '@/shared/decorators/is-organization-slug.decorator';

export class CreateOrganizationDto {
	@IsString()
	@IsNotEmpty()
	@IsOrganizationSlug()
	@ApiProperty({ description: 'The unique slug of the organization (used as public tenant ID in URLs)' })
	slug: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ description: 'The name of the organization' })
	name: string;

	@IsUUID()
	@IsNotEmpty()
	@ApiProperty({ description: 'ID of the chosen plan' })
	plan_id: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({ description: "Owner's CPF or CNPJ, required by AbacatePay to create the billing customer" })
	owner_tax_id: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ description: 'The description of the organization' })
	description?: string;

	@IsString()
	@IsOptional()
	@ApiPropertyOptional({ description: 'The logo path of the organization' })
	logo?: string;
}
