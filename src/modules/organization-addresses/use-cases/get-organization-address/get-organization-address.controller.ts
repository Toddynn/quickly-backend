import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrganizationAddress } from '../../models/entities/organization-address.entity';
import { GetOrganizationAddressDocs } from './docs';
import { GetOrganizationAddressUseCase } from './get-organization-address.use-case';

@ApiTags('Organization Addresses')
@Controller('organization-addresses')
export class GetOrganizationAddressController {
	constructor(
		@Inject(GetOrganizationAddressUseCase)
		private readonly getOrganizationAddressUseCase: GetOrganizationAddressUseCase,
	) {}

	@Get(':id')
	@GetOrganizationAddressDocs()
	async execute(@Param('id') id: string): Promise<OrganizationAddress> {
		return await this.getOrganizationAddressUseCase.execute(id);
	}
}
