import { NotFoundException } from '@nestjs/common';

export class NotFoundSubscriptionException extends NotFoundException {
	constructor(fields: string) {
		super({ message: 'Assinatura não encontrada', fields });
	}
}
