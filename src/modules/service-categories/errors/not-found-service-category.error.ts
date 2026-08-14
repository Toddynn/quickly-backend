import { NotFoundException } from '@nestjs/common';

export class NotFoundServiceCategoryException extends NotFoundException {
	constructor(fields: string) {
		super({ message: 'Categoria de serviço não encontrada', fields });
		this.name = 'NotFoundServiceCategoryException';
	}
}
