import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Customer } from '../../models/entities/customer.entity';

export function GetCustomerDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Get a customer by ID',
			description: 'Retrieves a customer by its ID with related organization and user data.',
		}),
		ApiParam({
			name: 'id',
			description: 'The customer ID',
			type: String,
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Customer retrieved successfully.',
			type: Customer,
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Customer not found.',
		}),
	);
}

