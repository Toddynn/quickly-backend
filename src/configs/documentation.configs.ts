import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

export function setupDocumentationConfig(app: INestApplication) {
	const config = new DocumentBuilder().setTitle(`Quickly API`).setDescription(`The Quickly API description`).setVersion(`1.0`).addBearerAuth().build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup(`api/docs`, app, document, {
		swaggerOptions: {
			persistAuthorization: true,
		},
	});

	app.use('/reference', apiReference({ content: document }));
}
