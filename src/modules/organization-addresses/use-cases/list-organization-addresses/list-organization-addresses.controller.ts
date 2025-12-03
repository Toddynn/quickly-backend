import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import { ListOrganizationAddressesDto } from '../../models/dto/list-organization-addresses.dto';
import { OrganizationAddress } from '../../models/entities/organization-address.entity';
import { ListOrganizationAddressesDocs } from './docs';
import { ListOrganizationAddressesUseCase } from './list-organization-addresses.use-case';

@ApiTags('Organization Addresses')
@Controller('organization-addresses')
export class ListOrganizationAddressesController {
	constructor(
		@Inject(ListOrganizationAddressesUseCase)
		private readonly listOrganizationAddressesUseCase: ListOrganizationAddressesUseCase,
	) {}

	@Get()
	@ListOrganizationAddressesDocs()
	async execute(@Query() listDto: ListOrganizationAddressesDto): Promise<PaginatedResponseDto<OrganizationAddress>> {
		return await this.listOrganizationAddressesUseCase.execute(listDto);
	}
}

