import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { env } from '@/shared/constants/env-variables';

export function setupDocumentationConfig(app: INestApplication) {
	const config = new DocumentBuilder().setTitle(`Quickly API`).setDescription(`The Quickly API description`).setVersion(`1.0`).addBearerAuth().build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup(`api/swagger/reference`, app, document, {
		swaggerOptions: {
			persistAuthorization: true,
			apiCookieAuth: env.SESSION_NAME,
		},
		customSiteTitle: 'API / Quickly',
	});

	app.use('/api/scalar/reference', apiReference({ content: document }));
}
