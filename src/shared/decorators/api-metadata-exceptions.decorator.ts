import { BadRequestException, HttpCode, HttpException, HttpStatus, NotFoundException, applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ThrowsException(exception: new (...args: unknown[]) => Error, statusCode?: HttpStatus) {
	// Se o statusCode não foi fornecido, tenta extrair da exceção
	let finalStatusCode = statusCode;

	if (!finalStatusCode) {
		// Verifica se a exceção estende NotFoundException
		if (exception.prototype instanceof NotFoundException || exception === NotFoundException) {
			finalStatusCode = HttpStatus.NOT_FOUND;
		}
		// Verifica se a exceção estende BadRequestException
		else if (exception.prototype instanceof BadRequestException || exception === BadRequestException) {
			finalStatusCode = HttpStatus.BAD_REQUEST;
		}
		// Verifica se a exceção estende HttpException
		else if (exception.prototype instanceof HttpException || exception === HttpException) {
			// Tenta instanciar temporariamente para pegar o status code padrão
			try {
				const tempInstance = new exception('temp') as HttpException;
				finalStatusCode = tempInstance.getStatus();
			} catch {
				// Se falhar, usa BAD_REQUEST como padrão
				finalStatusCode = HttpStatus.BAD_REQUEST;
			}
		} else {
			// Se não for HttpException, usa o padrão
			finalStatusCode = HttpStatus.BAD_REQUEST;
		}
	}

	return applyDecorators(
		HttpCode(finalStatusCode),
		ApiResponse({
			status: finalStatusCode,
			description: exception.name,
		}),
	);
}
