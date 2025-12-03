import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function DeleteCustomerDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Delete a customer',
			description: 'Deletes a customer by its ID.',
		}),
		ApiParam({
			name: 'id',
			description: 'The customer ID',
			type: String,
		}),
		ApiResponse({
			status: HttpStatus.NO_CONTENT,
			description: 'Customer deleted successfully.',
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Customer not found.',
		}),
	);
}

