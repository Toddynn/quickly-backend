import { ForbiddenException } from '@nestjs/common';

export class PlanLimitExceededException extends ForbiddenException {
	constructor(limitKey: string, limit: number) {
		super({
			message: `Limite do plano atingido para "${limitKey}" (máximo: ${limit}). Faça upgrade do plano para continuar.`,
			limitKey,
			limit,
		});
	}
}
