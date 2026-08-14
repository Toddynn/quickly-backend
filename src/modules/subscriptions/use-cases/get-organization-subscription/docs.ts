import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubscriptionDto } from '../../models/dto/output/subscription.dto';

export function GetOrganizationSubscriptionDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Get the active organization subscription',
			description: 'Returns the subscription tied to the currently active organization in the session.',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Subscription retrieved successfully.',
			type: SubscriptionDto,
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'The organization has no subscription.',
		}),
	);
}
