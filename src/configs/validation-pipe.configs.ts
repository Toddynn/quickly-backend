import type { ValidationPipe } from '@nestjs/common';
import { ReflectionGuardValidationPipe } from '@/shared/pipes/safe-validation.pipe';

export function setupGlobalPipes(): ValidationPipe {
	return new ReflectionGuardValidationPipe({
		transform: true,
		whitelist: true,
		forbidNonWhitelisted: true,
	});
}
