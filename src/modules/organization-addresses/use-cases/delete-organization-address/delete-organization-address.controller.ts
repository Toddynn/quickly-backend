import { Controller, Delete, Inject, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteOrganizationAddressUseCase } from './delete-organization-address.use-case';
import { DeleteOrganizationAddressDocs } from './docs';

@ApiTags('Organization Addresses')
@Controller('organization-addresses')
export class DeleteOrganizationAddressController {
	constructor(
		@Inject(DeleteOrganizationAddressUseCase)
		private readonly deleteOrganizationAddressUseCase: DeleteOrganizationAddressUseCase,
	) {}

	@Delete(':id')
	@DeleteOrganizationAddressDocs()
	async execute(@Param('id') id: string): Promise<void> {
		return await this.deleteOrganizationAddressUseCase.execute(id);
	}
}

