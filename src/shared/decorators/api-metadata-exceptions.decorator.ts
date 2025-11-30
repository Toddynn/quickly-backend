import { HttpCode, HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ThrowsException(exception: new (...args: unknown[]) => Error, statusCode: HttpStatus = HttpStatus.BAD_REQUEST) {
	return applyDecorators(
		HttpCode(statusCode),
		ApiResponse({
			status: statusCode,
			description: exception.name,
		}),
	);
}
