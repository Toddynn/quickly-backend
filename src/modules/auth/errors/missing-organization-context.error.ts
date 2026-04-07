import { ForbiddenException } from '@nestjs/common';

export class MissingOrganizationContextException extends ForbiddenException {
	constructor() {
		super('Contexto de organização ativa é obrigatório para esta operação. Faça login em uma organização ou use switch-organization.');
		this.name = 'MissingOrganizationContextException';
	}
}
