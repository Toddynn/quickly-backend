import 'dotenv/config';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { setupDocumentationConfig } from './configs/documentation/documentation.config';
import { authenticatedSessionLifecycleMiddleware } from './configs/session/authenticated-session.middleware';
import { SessionConfigService } from './configs/session/session-config.service';
import { FRONT_END_URL, env } from './shared/constants/env-variables';
import { ReflectionGuardValidationPipe } from './shared/pipes/safe-validation.pipe';

async function bootstrap() {
	// bodyParser desligado no create() e reaplicado manualmente abaixo: a rota de webhook da
	// AbacatePay precisa do corpo raw (Buffer) pra validar a assinatura HMAC antes do JSON parse.
	const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });

	app.use(
		'/webhooks/abacate-pay',
		json({
			verify: (req, _res, buf) => {
				(req as unknown as { rawBody: Buffer }).rawBody = buf;
			},
		}),
	);
	app.use(json());
	app.use(urlencoded({ extended: true }));

	app.useGlobalPipes(app.get(ReflectionGuardValidationPipe));

	app.set('trust proxy', 1);

	const corsOptions: CorsOptions = {
		origin: [FRONT_END_URL],
		credentials: true,
	};
	app.enableCors(corsOptions);

	const sessionConfigService = app.get(SessionConfigService);
	const sessionMiddleware = await sessionConfigService.getSessionMiddleware();
	app.use(sessionMiddleware);
	app.use(authenticatedSessionLifecycleMiddleware);

	if (process.env.NODE_ENV !== 'production') {
		setupDocumentationConfig(app);
	}

	await app.listen(env.APP_PORT ?? 3000, '0.0.0.0');
}

bootstrap().catch((error) => {
	console.error('Falha ao iniciar a aplicação:', error);
	process.exit(1);
});
