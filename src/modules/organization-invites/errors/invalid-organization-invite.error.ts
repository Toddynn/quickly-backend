import { BadRequestException } from '@nestjs/common';

export class InvalidOrganizationInviteException extends BadRequestException {
	constructor(reason: string) {
		super(`Convite da organização inválido: ${reason}`);
		this.name = 'InvalidOrganizationInviteException';
	}
}
