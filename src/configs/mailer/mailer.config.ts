import { registerAs } from '@nestjs/config';

export default registerAs('mailer', () => ({
	host: process.env.MAIL_HOST,
	port: Number(process.env.MAIL_PORT ?? 587),
	user: process.env.MAIL_USERNAME,
	pass: process.env.MAIL_PASSWORD,
	secure: process.env.MAIL_SECURE === 'true',
	fromName: process.env.MAIL_DEFAULT_FROM ?? 'No-Reply',
	fromEmail: process.env.MAIL_DEFAULT_FROM ?? 'no-reply@quickly.com',
	ignoreTls: process.env.MAIL_IGNORE_TLS === 'true',
}));
