import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { getExceptionResponseSchema } from '@/shared/helpers/exception-response-schema.helper';
import { NotFoundCustomerException } from '../../errors/not-found-customer.error';
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
		ApiResponse(getExceptionResponseSchema(NotFoundCustomerException, 'id=123', 'Customer not found.')),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while fetching customer.',
		}),
	);
}
