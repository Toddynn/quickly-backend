import { ConflictException } from '@nestjs/common';

export class SubscriptionAlreadyExistsException extends ConflictException {
	constructor(details: string) {
		super({ message: 'A organização já possui uma assinatura', details });
	}
}
