import { NotFoundException } from '@nestjs/common';

export class NotFoundServiceCategoryException extends NotFoundException {
	constructor(fields: string) {
		super(`Categoria de serviço não encontrada com os critérios: ${fields}`);
		this.name = 'NotFoundServiceCategoryException';
	}
}
