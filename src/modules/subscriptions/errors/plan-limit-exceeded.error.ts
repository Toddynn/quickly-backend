import { ForbiddenException } from '@nestjs/common';

const LIMIT_LABELS: Record<string, string> = {
	professionals: 'profissionais',
	services: 'serviços',
};

export class PlanLimitExceededException extends ForbiddenException {
	constructor(limitKey: string, limit: number) {
		const label = LIMIT_LABELS[limitKey] ?? limitKey;
		super({
			message: `Limite do plano atingido para ${label} (máximo: ${limit}). Faça upgrade do plano para continuar.`,
			fields: limitKey,
			limit,
		});
	}
}
