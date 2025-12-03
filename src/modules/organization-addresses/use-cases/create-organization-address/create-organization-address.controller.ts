import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrganizationAddressDto } from '../../models/dto/create-organization-address.dto';
import { OrganizationAddress } from '../../models/entities/organization-address.entity';
import { CreateOrganizationAddressUseCase } from './create-organization-address.use-case';
import { CreateOrganizationAddressDocs } from './docs';

@ApiTags('Organization Addresses')
@Controller('organization-addresses')
export class CreateOrganizationAddressController {
	constructor(
		@Inject(CreateOrganizationAddressUseCase)
		private readonly createOrganizationAddressUseCase: CreateOrganizationAddressUseCase,
	) {}

	@Post()
	@CreateOrganizationAddressDocs()
	async execute(@Body() createOrganizationAddressDto: CreateOrganizationAddressDto): Promise<OrganizationAddress> {
		return await this.createOrganizationAddressUseCase.execute(createOrganizationAddressDto);
	}
}

