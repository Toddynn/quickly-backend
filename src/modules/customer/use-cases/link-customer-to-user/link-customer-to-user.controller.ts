import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { LinkCustomerToUserDto } from '../../models/dto/input/link-customer-to-user.dto';
import { Customer } from '../../models/entities/customer.entity';
import { LinkCustomerToUserUseCase } from './link-customer-to-user.use-case';
import { LinkCustomerToUserDocs } from './docs';

@ApiTags('Customers')
@Controller('customers')
export class LinkCustomerToUserController {
	constructor(
		@Inject(LinkCustomerToUserUseCase)
		private readonly linkCustomerToUserUseCase: LinkCustomerToUserUseCase,
	) {}

	@Patch(':id/link-user')
	@LinkCustomerToUserDocs()
	async execute(@Param('id') id: string, @Body() linkCustomerToUserDto: LinkCustomerToUserDto): Promise<Customer> {
		return await this.linkCustomerToUserUseCase.execute(id, linkCustomerToUserDto);
	}
}

