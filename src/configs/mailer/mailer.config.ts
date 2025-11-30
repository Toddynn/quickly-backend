import { registerAs } from '@nestjs/config';

export default registerAs('mailer', () => ({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 1025,
	user: process.env.MAIL_USERNAME,
	pass: process.env.MAIL_PASSWORD,
	secure: process.env.MAIL_SECURE === 'true',
	fromName: process.env.MAIL_FROM_NAME ?? 'No-Reply',
	fromEmail: process.env.MAIL_FROM_EMAIL ?? process.env.MAIL_DEFAULT_FROM ?? 'no-reply@quickly.com',
	ignoreTls: process.env.MAIL_IGNORE_TLS === 'true',
}));
