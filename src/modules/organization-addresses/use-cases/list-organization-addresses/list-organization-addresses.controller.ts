import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListOrganizationAddressesDto } from '../../models/dto/input/list-organization-addresses.dto';
import { ListOrganizationAddressResponseDto } from '../../models/dto/output/list-organization-address-response.dto';
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
	async execute(@Query() listDto: ListOrganizationAddressesDto): Promise<PaginatedResponseDto<ListOrganizationAddressResponseDto>> {
		return await this.listOrganizationAddressesUseCase.execute(listDto);
	}
}

