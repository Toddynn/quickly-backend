import { createHmac, timingSafeEqual } from 'node:crypto';
import { BadRequestException, Controller, Headers, HttpCode, HttpStatus, Inject, Post, Req } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { Request } from 'express';
import { Public } from '@/modules/auth/shared/decorators/public.decorator';
import { env } from '@/shared/constants/env-variables';
import { HandleAbacatePayWebhookUseCase } from './handle-abacate-pay-webhook.use-case';

@ApiExcludeController()
@Controller('webhooks/abacate-pay')
export class AbacatePayWebhookController {
	constructor(
		@Inject(HandleAbacatePayWebhookUseCase)
		private readonly handleAbacatePayWebhookUseCase: HandleAbacatePayWebhookUseCase,
	) {}

	@Public()
	@Post()
	@HttpCode(HttpStatus.OK)
	async execute(@Req() request: Request & { rawBody?: Buffer }, @Headers('x-webhook-signature') signature: string | undefined): Promise<{ received: true }> {
		const rawBody = request.rawBody;
		if (!rawBody || !signature) {
			throw new BadRequestException('Assinatura ou corpo do webhook ausente');
		}

		const expectedSignature = createHmac('sha256', env.ABACATE_PAY_WEBHOOK_PUBLIC_KEY).update(rawBody).digest('hex');
		const signatureBuffer = Buffer.from(signature);
		const expectedBuffer = Buffer.from(expectedSignature);

		if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
			throw new BadRequestException('Assinatura do webhook inválida');
		}

		await this.handleAbacatePayWebhookUseCase.execute(request.body);
		return { received: true };
	}
}
