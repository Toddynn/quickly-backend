import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';
import { UpdateOrganizationAddressDto } from '../../models/dto/update-organization-address.dto';
import { UpdateOrganizationAddressDocs } from './docs';
import { UpdateOrganizationAddressUseCase } from './update-organization-address.use-case';

@ApiTags('Organization Addresses')
@Controller('organization-addresses')
export class UpdateOrganizationAddressController {
	constructor(
		@Inject(UpdateOrganizationAddressUseCase)
		private readonly updateOrganizationAddressUseCase: UpdateOrganizationAddressUseCase,
	) {}

	@Patch(':id')
	@UpdateOrganizationAddressDocs()
	async execute(@Param('id') id: string, @Body() updateOrganizationAddressDto: UpdateOrganizationAddressDto): Promise<UpdateResult> {
		return await this.updateOrganizationAddressUseCase.execute(id, updateOrganizationAddressDto);
	}
}

