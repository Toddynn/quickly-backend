import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ChangePlanDto } from '../../models/dto/input/change-plan.dto';
import { SubscriptionDto } from '../../models/dto/output/subscription.dto';

export function ChangeSubscriptionPlanDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Change the organization plan',
			description: 'Owner-only. The change is applied at the next billing cycle on AbacatePay; the local plan reference is updated immediately.',
		}),
		ApiBody({ type: ChangePlanDto }),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Plan changed successfully.',
			type: SubscriptionDto,
		}),
		ApiResponse({
			status: HttpStatus.FORBIDDEN,
			description: 'Only the organization owner can change the plan.',
		}),
	);
}
