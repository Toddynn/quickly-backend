import { HttpException, InternalServerErrorException } from '@nestjs/common';

export function rethrowHttpOrInternal(error: unknown, fallbackMessage = 'Não foi possível concluir a operação. Tente novamente.'): never {
	if (error instanceof HttpException) {
		throw error;
	}

	throw new InternalServerErrorException(fallbackMessage);
}
