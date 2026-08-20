import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function CreateAnnualCheckoutDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Start an annual-plan Pix checkout',
			description:
				"Owner-only. Cancels any active monthly card subscription, then creates a one-time Pix checkout for the plan's annual price. " +
				'The subscription is only marked ANNUAL/ACTIVE once the `checkout.completed` webhook confirms payment — this endpoint only returns the checkout URL.',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Checkout created; the owner must complete the Pix payment at checkoutUrl.',
			schema: {
				type: 'object',
				properties: {
					checkoutUrl: { type: 'string' },
				},
			},
		}),
		ApiResponse({
			status: HttpStatus.FORBIDDEN,
			description: 'Only the organization owner can start an annual checkout.',
		}),
	);
}
