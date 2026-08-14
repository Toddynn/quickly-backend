import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Plan } from '../../models/entities/plan.entity';

export function ListPlansDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'List active plans',
			description: 'Public endpoint for the pricing page. Returns all active plans ordered by price.',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Plans retrieved successfully.',
			type: [Plan],
		}),
	);
}
