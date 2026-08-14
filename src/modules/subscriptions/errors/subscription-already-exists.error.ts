import { ConflictException } from '@nestjs/common';

export class SubscriptionAlreadyExistsException extends ConflictException {
	constructor(fields: string) {
		super({ message: 'A organização já possui uma assinatura', fields });
	}
}
