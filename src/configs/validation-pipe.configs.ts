import { ValidationPipe } from '@nestjs/common';

export function setupGlobalPipes(): ValidationPipe {
     return new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
          forbidUnknownValues: true,
     });
}
