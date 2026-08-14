import { NotFoundException } from '@nestjs/common';

export class NotFoundPlanException extends NotFoundException {
	constructor(fields: string) {
		super({ message: 'Plano não encontrado', fields });
	}
}
