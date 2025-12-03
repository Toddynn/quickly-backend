import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { LinkCustomerToUserDto } from '../../models/dto/input/link-customer-to-user.dto';
import { Customer } from '../../models/entities/customer.entity';

export function LinkCustomerToUserDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Link customer to user',
			description:
				'Links an anonymous customer to an existing user account. This is useful when a customer creates an account after making an anonymous appointment.',
		}),
		ApiParam({
			name: 'id',
			description: 'The customer ID',
			type: String,
		}),
		ApiBody({
			type: LinkCustomerToUserDto,
			description: 'Data for linking customer to user',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Customer linked to user successfully.',
			type: Customer,
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Customer or user not found.',
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Customer already linked to a user or user already has a customer with this email in this organization.',
		}),
	);
}
