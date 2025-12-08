import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { setupDocumentationConfig } from './configs/documentation.configs';
import { setupGlobalPipes } from './configs/validation-pipe.configs';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	const configService = app.get(ConfigService);

	app.set('trust proxy', 1);

	app.enableCors({
		credentials: true,
		origin: [`http://192.168.155.61:3737`, 'http://localhost:3737'],
	});

	app.useGlobalPipes(setupGlobalPipes());

	setupDocumentationConfig(app);

	await app.listen(configService.get<string>('APP_PORT') ?? 3000, '0.0.0.0');
}
bootstrap();
