import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListCustomerResponseDto } from '../../models/dto/output/list-customer-response.dto';

export function ListCustomersDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'List customers',
			description: 'Retrieves a paginated list of customers with optional filters by organization, user, and search.',
		}),
		ApiQuery({
			name: 'page',
			required: false,
			type: Number,
			description: 'Page number',
		}),
		ApiQuery({
			name: 'limit',
			required: false,
			type: Number,
			description: 'Items per page',
		}),
		ApiQuery({
			name: 'organization_id',
			required: false,
			type: String,
			description: 'Filter by organization ID',
		}),
		ApiQuery({
			name: 'user_id',
			required: false,
			type: String,
			description: 'Filter by user ID (use empty string for anonymous customers)',
		}),
		ApiQuery({
			name: 'search',
			required: false,
			type: String,
			description: 'Search by name, email or phone',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Customers retrieved successfully.',
			type: Object as () => PaginatedResponseDto<ListCustomerResponseDto>,
		}),
	);
}

