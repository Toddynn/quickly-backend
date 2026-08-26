import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function CreateSubscriptionCheckoutDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Start or restart the monthly card checkout',
			description:
				'Owner-only. Cancels any dangling AbacatePay subscription and opens a new card checkout for the current plan — ' +
				'used to finish an abandoned trial checkout or to reactivate a PAST_DUE/EXPIRED subscription. ' +
				'The subscription is only marked ACTIVE once the `subscription.completed` webhook confirms the card.',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Checkout created; the owner must complete the card registration at checkoutUrl.',
			schema: {
				type: 'object',
				properties: {
					checkoutUrl: { type: 'string' },
				},
			},
		}),
		ApiResponse({
			status: HttpStatus.FORBIDDEN,
			description: 'Only the organization owner can (re)start the subscription checkout.',
		}),
	);
}
