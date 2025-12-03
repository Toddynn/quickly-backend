import { Controller, Delete, Inject, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteCustomerUseCase } from './delete-customer.use-case';
import { DeleteCustomerDocs } from './docs';

@ApiTags('Customers')
@Controller('customers')
export class DeleteCustomerController {
	constructor(
		@Inject(DeleteCustomerUseCase)
		private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
	) {}

	@Delete(':id')
	@DeleteCustomerDocs()
	async execute(@Param('id') id: string): Promise<void> {
		return await this.deleteCustomerUseCase.execute(id);
	}
}

