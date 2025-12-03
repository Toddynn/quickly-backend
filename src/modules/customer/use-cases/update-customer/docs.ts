import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateCustomerDto } from '../../models/dto/input/update-customer.dto';
import { Customer } from '../../models/entities/customer.entity';

export function UpdateCustomerDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Update a customer',
			description: 'Updates customer information. All fields are optional.',
		}),
		ApiParam({
			name: 'id',
			description: 'The customer ID',
			type: String,
		}),
		ApiBody({
			type: UpdateCustomerDto,
			description: 'Data for customer update',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Customer updated successfully.',
			type: Customer,
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Customer not found.',
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Invalid data for customer update or email already exists.',
		}),
	);
}
