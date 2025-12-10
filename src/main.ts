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

	const frontEndProtocol = configService.get<string>('FRONT_END_PROTOCOL');
	const frontEndDomain = configService.get<string>('FRONT_END_DOMAIN');
	const frontEndPort = configService.get<string>('FRONT_END_PORT');
	const frontEndUrl = `${frontEndProtocol}://${frontEndDomain}:${frontEndPort}`;

	app.enableCors({
		credentials: true,
		origin: [frontEndUrl, `${frontEndProtocol}://localhost:${frontEndPort}`],
	});

	app.useGlobalPipes(setupGlobalPipes());

	setupDocumentationConfig(app);

	await app.listen(configService.get<string>('APP_PORT') ?? 3000, '0.0.0.0');
}
bootstrap();
