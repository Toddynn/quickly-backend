import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Organization } from '@/modules/organizations/models/entities/organization.entity';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';

@Entity('organization_addresses')
export class OrganizationAddress extends TimestampedEntity {
	@Column({ name: 'organization_id' })
	@ApiProperty({ description: 'The organization ID' })
	organization_id: string;

	@Column({ name: 'postal_code' })
	@ApiProperty({ description: 'The postal code (CEP)' })
	postal_code: string;

	@Column({ nullable: true, name: 'street' })
	@ApiProperty({ description: 'The street name (logradouro)' })
	street: string;

	@Column({ nullable: true, name: 'complement' })
	@ApiProperty({ description: 'The address complement (complemento)' })
	complement: string;

	@Column({ nullable: true, name: 'neighborhood' })
	@ApiProperty({ description: 'The neighborhood (bairro)' })
	neighborhood: string;

	@Column({ nullable: true, name: 'city' })
	@ApiProperty({ description: 'The city (localidade)' })
	city: string;

	@Column({ nullable: true, name: 'state', length: 2 })
	@ApiProperty({ description: 'The state (UF)' })
	state: string;

	@Column({ nullable: true, name: 'ibge_code' })
	@ApiProperty({ description: 'The IBGE code of the municipality' })
	ibge_code: string;

	@Column({ nullable: true, name: 'gia_code' })
	@ApiProperty({ description: 'The GIA code (used in São Paulo state)' })
	gia_code: string;

	@Column({ nullable: true, name: 'ddd', length: 3 })
	@ApiProperty({ description: 'The area code (DDD)' })
	ddd: string;

	@Column({ nullable: true, name: 'siafi_code' })
	@ApiProperty({ description: 'The SIAFI code of the municipality' })
	siafi_code: string;

	@ManyToOne(() => Organization)
	@JoinColumn({ name: 'organization_id' })
	@ApiProperty({ description: 'The organization', type: () => Organization })
	organization: Organization;
}
