import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubscriptionDto } from '../../models/dto/output/subscription.dto';

export function CancelSubscriptionDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Cancel the organization subscription',
			description: 'Owner-only. Cancels immediately on AbacatePay (no grace period) and marks the local subscription as CANCELED.',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Subscription canceled successfully.',
			type: SubscriptionDto,
		}),
		ApiResponse({
			status: HttpStatus.FORBIDDEN,
			description: 'Only the organization owner can cancel the subscription.',
		}),
	);
}
